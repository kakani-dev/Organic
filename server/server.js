import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const ordersFilePath = path.join(__dirname, 'orders.json');

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency = 'inr' } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            automatic_payment_methods: { enabled: true },
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ error: error.message });
    }
});

app.post('/orders', (req, res) => {
    try {
        const order = req.body;
        order.id = 'ORD-' + Date.now();
        order.date = new Date().toISOString();

        let orders = [];
        if (fs.existsSync(ordersFilePath)) {
            const data = fs.readFileSync(ordersFilePath, 'utf8');
            orders = JSON.parse(data || '[]');
        }

        orders.push(order);
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

        res.status(201).json(order);
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).send({ error: 'Failed to save order' });
    }
});

app.get('/orders', (req, res) => {
    try {
        if (fs.existsSync(ordersFilePath)) {
            const data = fs.readFileSync(ordersFilePath, 'utf8');
            res.json(JSON.parse(data || '[]'));
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send({ error: 'Failed to fetch orders' });
    }
});

app.post('/send-receipt', async (req, res) => {
    const { email, orderDetails, amount } = req.body;
    try {
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            let pdfData = Buffer.concat(buffers);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Organic Shop Receipt',
                text: `Thank you for your order!\nTotal: ₹${amount}`,
                attachments: [{ filename: 'receipt.pdf', content: pdfData }]
            };
            await transporter.sendMail(mailOptions);
            res.status(200).send({ message: 'Receipt sent successfully' });
        });

        doc.fontSize(25).text('Organic Shop Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`);
        doc.text(`Total Amount: ₹${amount}`);
        doc.moveDown();
        doc.text('Order Details:');
        orderDetails.forEach(item => { doc.text(`${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`); });
        doc.moveDown();
        doc.text('Thank you for shopping with us!', { align: 'center' });
        doc.end();

    } catch (error) {
        console.error('Error sending receipt:', error);
        res.status(500).send({ error: 'Failed to send receipt' });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
