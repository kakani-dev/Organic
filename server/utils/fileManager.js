import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FILE_PATHS } from '../constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.join(__dirname, '..');

const ordersFilePath = path.join(serverDir, FILE_PATHS.ORDERS);
const backupsDir = path.join(serverDir, FILE_PATHS.BACKUPS_DIR);

// Simple file lock using a lock file
const lockFilePath = path.join(serverDir, '.orders.lock');
let lockAcquired = false;

/**
 * Ensure required directories exist
 */
export function ensureDirectories() {
    if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true });
    }
}

/**
 * Acquire file lock with timeout
 * @param {number} timeout - Maximum wait time in ms
 * @returns {Promise<boolean>}
 */
export async function acquireLock(timeout = 5000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        try {
            // Try to create lock file exclusively
            fs.writeFileSync(lockFilePath, process.pid.toString(), { flag: 'wx' });
            lockAcquired = true;
            return true;
        } catch (err) {
            // Lock file exists, wait a bit
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    return false;
}

/**
 * Release file lock
 */
export function releaseLock() {
    if (lockAcquired && fs.existsSync(lockFilePath)) {
        try {
            fs.unlinkSync(lockFilePath);
            lockAcquired = false;
        } catch (err) {
            console.error('Error releasing lock:', err);
        }
    }
}

/**
 * Create backup of orders file
 * @returns {string|null} Backup file path or null if failed
 */
export function createBackup() {
    try {
        if (!fs.existsSync(ordersFilePath)) {
            return null; // No file to backup
        }

        ensureDirectories();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupsDir, `orders-${timestamp}.json`);

        fs.copyFileSync(ordersFilePath, backupPath);
        console.log(`✓ Backup created: ${backupPath}`);

        // Keep only last 10 backups
        cleanOldBackups(10);

        return backupPath;
    } catch (error) {
        console.error('Error creating backup:', error);
        return null;
    }
}

/**
 * Clean old backup files, keeping only the most recent N files
 * @param {number} keepCount - Number of backups to keep
 */
function cleanOldBackups(keepCount = 10) {
    try {
        if (!fs.existsSync(backupsDir)) return;

        const files = fs.readdirSync(backupsDir)
            .filter(f => f.startsWith('orders-') && f.endsWith('.json'))
            .map(f => ({
                name: f,
                path: path.join(backupsDir, f),
                time: fs.statSync(path.join(backupsDir, f)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time); // Sort by newest first

        // Delete old backups
        files.slice(keepCount).forEach(file => {
            fs.unlinkSync(file.path);
            console.log(`✓ Deleted old backup: ${file.name}`);
        });
    } catch (error) {
        console.error('Error cleaning old backups:', error);
    }
}

/**
 * Read orders from JSON file
 * @returns {Promise<Array>} Array of orders
 */
export async function readOrders() {
    try {
        if (!fs.existsSync(ordersFilePath)) {
            return [];
        }

        const data = fs.readFileSync(ordersFilePath, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error reading orders:', error);
        throw new Error('Failed to read orders file');
    }
}

/**
 * Write orders to JSON file with atomic write and backup
 * @param {Array} orders - Array of orders to save
 * @returns {Promise<boolean>} Success status
 */
export async function writeOrders(orders) {
    const tempFilePath = ordersFilePath + '.tmp';

    try {
        // Acquire lock
        const locked = await acquireLock();
        if (!locked) {
            throw new Error('Could not acquire file lock');
        }

        // Create backup before writing
        createBackup();

        // Write to temporary file first (atomic write)
        fs.writeFileSync(tempFilePath, JSON.stringify(orders, null, 2), 'utf8');

        // Rename temp file to actual file (atomic operation)
        fs.renameSync(tempFilePath, ordersFilePath);

        console.log(`✓ Orders saved successfully (${orders.length} orders)`);
        return true;
    } catch (error) {
        // Clean up temp file if it exists
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        console.error('Error writing orders:', error);
        throw new Error('Failed to save orders');
    } finally {
        // Always release lock
        releaseLock();
    }
}

/**
 * Add a new order to the orders file
 * @param {Object} order - Order object to add
 * @returns {Promise<Object>} The saved order with ID
 */
export async function addOrder(order) {
    try {
        const orders = await readOrders();

        // Generate unique order ID
        order.id = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        order.date = new Date().toISOString();

        orders.push(order);
        await writeOrders(orders);

        return order;
    } catch (error) {
        console.error('Error adding order:', error);
        throw error;
    }
}

// Initialize directories on module load
ensureDirectories();
