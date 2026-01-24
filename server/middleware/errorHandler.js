import { HTTP_STATUS } from '../constants.js';

/**
 * Global error handler middleware
 * Must be placed after all routes
 */
export const errorHandler = (err, req, res, next) => {
    // Log error details
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR:', err.message);
    console.error('Time:', new Date().toISOString());
    console.error('Method:', req.method);
    console.error('Path:', req.path);
    console.error('IP:', req.ip);
    if (err.stack) {
        console.error('Stack:', err.stack);
    }
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Determine status code
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

    // Prepare error response
    const errorResponse = {
        error: err.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
    };

    // Add stack trace in development mode
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.details = err.details;
    }

    res.status(statusCode).json(errorResponse);
};

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';

        console.log(
            `${statusColor} ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${req.ip}`
        );
    });

    next();
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
};
