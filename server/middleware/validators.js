import { body, validationResult } from 'express-validator';
import { VALIDATION_RULES, ERROR_MESSAGES, HTTP_STATUS } from '../constants.js';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: ERROR_MESSAGES.INVALID_ORDER,
            details: errors.array()
        });
    }
    next();
};

/**
 * Validate payment intent request
 */
export const validatePaymentIntent = [
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .custom((value) => {
            if (value < VALIDATION_RULES.MIN_AMOUNT || value > VALIDATION_RULES.MAX_AMOUNT) {
                throw new Error(ERROR_MESSAGES.INVALID_AMOUNT);
            }
            return true;
        }),
    body('currency')
        .optional()
        .isString()
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency must be a 3-letter code'),
    handleValidationErrors
];

/**
 * Validate order creation request
 */
export const validateOrder = [
    // Customer validation
    body('customer').isObject().withMessage('Customer information is required'),
    body('customer.name')
        .trim()
        .notEmpty()
        .withMessage('Customer name is required')
        .isLength({ max: VALIDATION_RULES.MAX_NAME_LENGTH })
        .withMessage(`Name must be less than ${VALIDATION_RULES.MAX_NAME_LENGTH} characters`),
    body('customer.email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage(ERROR_MESSAGES.INVALID_EMAIL)
        .normalizeEmail(),
    body('customer.address')
        .optional()
        .trim()
        .isLength({ max: VALIDATION_RULES.MAX_ADDRESS_LENGTH })
        .withMessage(`Address must be less than ${VALIDATION_RULES.MAX_ADDRESS_LENGTH} characters`),
    body('customer.city')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('City name is too long'),
    body('customer.zip')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('ZIP code is too long'),

    // Items validation
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item')
        .custom((items) => {
            if (items.length > VALIDATION_RULES.MAX_ORDER_ITEMS) {
                throw new Error(`Order cannot contain more than ${VALIDATION_RULES.MAX_ORDER_ITEMS} items`);
            }
            return true;
        }),
    body('items.*.id')
        .isNumeric()
        .withMessage('Item ID must be a number'),
    body('items.*.name')
        .trim()
        .notEmpty()
        .withMessage('Item name is required'),
    body('items.*.price')
        .isNumeric()
        .withMessage('Item price must be a number')
        .custom((value) => value > 0)
        .withMessage('Item price must be positive'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Item quantity must be at least 1'),

    // Total validation
    body('total')
        .isNumeric()
        .withMessage('Total must be a number')
        .custom((value) => {
            if (value < VALIDATION_RULES.MIN_AMOUNT || value > VALIDATION_RULES.MAX_AMOUNT) {
                throw new Error(ERROR_MESSAGES.INVALID_AMOUNT);
            }
            return true;
        }),

    // Payment method validation
    body('paymentMethod')
        .trim()
        .notEmpty()
        .withMessage('Payment method is required')
        .isIn(['card', 'upi', 'demo'])
        .withMessage('Invalid payment method'),

    // Status validation
    body('status')
        .trim()
        .notEmpty()
        .withMessage('Order status is required')
        .isIn(['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
        .withMessage('Invalid order status'),

    handleValidationErrors
];

/**
 * Validate receipt email request
 */
export const validateReceipt = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage(ERROR_MESSAGES.INVALID_EMAIL)
        .normalizeEmail(),
    body('orderDetails')
        .isArray({ min: 1 })
        .withMessage('Order details must be an array with at least one item'),
    body('orderDetails.*.name')
        .trim()
        .notEmpty()
        .withMessage('Item name is required'),
    body('orderDetails.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Item quantity must be at least 1'),
    body('orderDetails.*.price')
        .isNumeric()
        .withMessage('Item price must be a number'),
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .custom((value) => value > 0)
        .withMessage('Amount must be positive'),
    handleValidationErrors
];
