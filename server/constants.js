/**
 * Server Configuration Constants
 */

export const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // Max requests per window
    MESSAGE: 'Too many requests from this IP, please try again later.'
};

export const FILE_PATHS = {
    ORDERS: 'orders.json',
    BACKUPS_DIR: 'backups'
};

export const VALIDATION_RULES = {
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 1000000, // ₹10 lakh max
    MAX_ORDER_ITEMS: 50,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_NAME_LENGTH: 100,
    MAX_ADDRESS_LENGTH: 500
};

export const ERROR_MESSAGES = {
    INVALID_AMOUNT: 'Amount must be a positive number between ₹1 and ₹10,00,000',
    INVALID_EMAIL: 'Please provide a valid email address',
    INVALID_ORDER: 'Invalid order data. Please check all required fields.',
    FILE_WRITE_ERROR: 'Failed to save order. Please try again.',
    FILE_READ_ERROR: 'Failed to retrieve orders.',
    EMAIL_SEND_ERROR: 'Order saved but failed to send receipt email.',
    MISSING_FIELDS: 'Required fields are missing',
    STRIPE_ERROR: 'Payment processing failed. Please try again.'
};

export const SUCCESS_MESSAGES = {
    ORDER_CREATED: 'Order created successfully',
    RECEIPT_SENT: 'Receipt sent successfully',
    PAYMENT_INTENT_CREATED: 'Payment intent created'
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
};
