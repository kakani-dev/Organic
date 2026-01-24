import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import utilities and middleware
import { readOrders, addOrder } from './utils/fileManager.js';
import { validatePaymentIntent, validateOrder, validateReceipt } from './middleware/validators.js';
import { errorHandler, requestLogger } from './middleware/errorHandler.js';
import { RATE_LIMIT, ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_STATUS } from './constants.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate required environment variables
const requiredEnvVars = ['STRIPE_SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

// Check if Stripe key is a placeholder
const isPlaceholderKey = process.env.STRIPE_SECRET_KEY.includes('...');
if (isPlaceholderKey) {
    console.warn('⚠️  WARNING: Using placeholder Stripe key. Payment functionality will not work.');
    console.warn('⚠️  Please update STRIPE_SECRET_KEY in .env with a real key from https://stripe.com');
}

const app = express();
let stripe = null;
try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    if (!isPlaceholderKey) {
        console.log('✓ Stripe initialized successfully');
    }
} catch (error) {
    console.warn('⚠️  Stripe initialization failed:', error.message);
    console.warn('⚠️  Payment endpoints will return errors');
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || '*'
        : '*',
    credentials: true
};
app.use(cors(corsOptions));

// Body parser with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: RATE_LIMIT.MAX_REQUESTS,
    message: { error: RATE_LIMIT.MESSAGE },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter); // Apply to API routes only

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log('✓ Email transporter configured');
} else {
    console.warn('⚠️  Email credentials not configured. Receipt emails will not be sent.');
}

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * Create Stripe payment intent
 */
app.post('/create-payment-intent', validatePaymentIntent, async (req, res, next) => {
    const { amount, currency = 'inr' } = req.body;

    // Check if Stripe is available
    if (!stripe) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: 'Payment service not configured. Please contact administrator.'
        });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            automatic_payment_methods: { enabled: true },
        });

        res.status(HTTP_STATUS.OK).json({
            clientSecret: paymentIntent.client_secret,
            message: SUCCESS_MESSAGES.PAYMENT_INTENT_CREATED
        });
    } catch (error) {
        console.error('Stripe error:', error);
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.message = ERROR_MESSAGES.STRIPE_ERROR;
        next(error);
    }
});

/**
 * Create new order
 */
app.post('/orders', validateOrder, async (req, res, next) => {
    try {
        const orderData = req.body;

        // Add order with file locking and backup
        const savedOrder = await addOrder(orderData);

        res.status(HTTP_STATUS.CREATED).json({
            order: savedOrder,
            message: SUCCESS_MESSAGES.ORDER_CREATED
        });
    } catch (error) {
        console.error('Order creation error:', error);
        error.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        error.message = ERROR_MESSAGES.FILE_WRITE_ERROR;
        next(error);
    }
});

/**
 * Get all orders
 */
app.get('/orders', async (req, res, next) => {
    try {
        const orders = await readOrders();
        res.status(HTTP_STATUS.OK).json(orders);
    } catch (error) {
        console.error('Order fetch error:', error);
        error.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        error.message = ERROR_MESSAGES.FILE_READ_ERROR;
        next(error);
    }
});

/**
 * Send receipt email
 */
app.post('/send-receipt', validateReceipt, async (req, res, next) => {
    const { email, orderDetails, amount } = req.body;

    // Check if email is configured
    if (!transporter) {
        console.warn('Email not configured, skipping receipt send');
        return res.status(HTTP_STATUS.OK).json({
            message: 'Order saved successfully. Email service not configured.',
            emailSent: false
        });
    }

    try {
        // Generate PDF receipt
        const pdfBuffer = await generatePDFReceipt(orderDetails, amount);

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Organic Shop Receipt',
            html: `
                <h2>Thank you for your order!</h2>
                <p>Your order has been confirmed.</p>
                <p><strong>Total Amount:</strong> ₹${amount}</p>
                <p>Please find your receipt attached.</p>
                <br>
                <p>Best regards,<br>Organic Shop Team</p>
            `,
            attachments: [
                {
                    filename: 'receipt.pdf',
                    content: pdfBuffer
                }
            ]
        };

        await transporter.sendMail(mailOptions);

        res.status(HTTP_STATUS.OK).json({
            message: SUCCESS_MESSAGES.RECEIPT_SENT,
            emailSent: true
        });
    } catch (error) {
        console.error('Email send error:', error);
        // Don't fail the request if email fails
        res.status(HTTP_STATUS.OK).json({
            message: ERROR_MESSAGES.EMAIL_SEND_ERROR,
            emailSent: false
        });
    }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate PDF receipt
 * @param {Array} orderDetails - Order items
 * @param {number} amount - Total amount
 * @returns {Promise<Buffer>} PDF buffer
 */
function generatePDFReceipt(orderDetails, amount) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // PDF content
        doc.fontSize(25).text('Organic Shop Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString('en-IN')}`, { align: 'left' });
        doc.text(`Time: ${new Date().toLocaleTimeString('en-IN')}`, { align: 'left' });
        doc.moveDown();
        doc.fontSize(14).text('Order Details:', { underline: true });
        doc.moveDown(0.5);

        // Order items
        orderDetails.forEach((item, index) => {
            doc.fontSize(11).text(
                `${index + 1}. ${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
            );
        });

        doc.moveDown();
        doc.fontSize(16).text(`Total Amount: ₹${amount.toFixed(2)}`, { bold: true });
        doc.moveDown(2);
        doc.fontSize(10).text('Thank you for shopping with us!', { align: 'center', italics: true });
        doc.text('For support, contact: support@organicfarms.com', { align: 'center' });

        doc.end();
    });
}

// ============================================================================
// CATCH-ALL ROUTE (Must be last)
// ============================================================================

// Serve React app for all other routes
// Note: Express 5 doesn't support '*' wildcard, use regex or specific paths
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ============================================================================
// ERROR HANDLING (Must be after all routes)
// ============================================================================

app.use(errorHandler);

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Rate limit: ${RATE_LIMIT.MAX_REQUESTS} requests per ${RATE_LIMIT.WINDOW_MS / 60000} minutes`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

