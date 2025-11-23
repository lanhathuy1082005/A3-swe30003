import pool from '../Database.js';

class OrderItem {

    static async createOrderItem(orderId, itemId, quantity, unitPrice, subtotal) {
        const result = await pool.query(
            'INSERT INTO order_items (order_id, item_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [orderId, itemId, quantity, unitPrice, subtotal]
        );
        return result.rows[0];
    }

    static async getOrderItems(orderId) {
        const result = await pool.query(
            `SELECT oi.*, m.item_name 
             FROM order_items oi
             JOIN menu m ON oi.item_id = m.id
             WHERE oi.order_id = $1`,
            [orderId]
        );
        return result.rows;
    }
}

export default OrderItem;