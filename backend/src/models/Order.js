import pool from '../Database.js';

class Order {

    static async createOrder(customer_id, final_price, payment_method, promotion_id, points_earned, points_redeemed) {
        const result = await pool.query(
            'INSERT INTO orders (customer_id, final_price, payment_method, promotion_id, order_status, points_earned, points_redeemed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [customer_id, final_price, payment_method, promotion_id, 'pending', points_earned, points_redeemed]
        );
        return result.rows[0];
    }

    static async getOrderById(orderId) {
        const result = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        return result.rows[0];
    }

    static async getOrdersByCustomerId(customerId) {
        const result = await pool.query(
            'SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC',
            [customerId]
        );
        return result.rows;
    }

    static async getAllOrders() {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        return result.rows;
    }

    static async updateOrderStatus(orderId, status) {
        const result = await pool.query(
            'UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *',
            [status, orderId]
        );
        return result.rows[0];
    }
}

export default Order;