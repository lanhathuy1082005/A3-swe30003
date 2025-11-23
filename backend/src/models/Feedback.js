import pool from '../Database.js';

class Feedback {
    static async createFeedback(customer_id, content, order_id = null) {
        const result = await pool.query(
            'INSERT INTO feedback (customer_id, content, order_id) VALUES ($1, $2, $3) RETURNING *',
            [customer_id, content, order_id]
        );
        return result.rows[0];
    }

    static async getAllFeedback() {
        const result = await pool.query(
            `SELECT f.*, u.name, u.email, o.id as order_number 
             FROM feedback f 
             JOIN users u ON f.customer_id = u.id 
             LEFT JOIN orders o ON f.order_id = o.id 
             ORDER BY f.created_at DESC`
        );
        return result.rows;
    }

    static async getFeedbackByCustomerId(customer_id) {
        const result = await pool.query(
            `SELECT f.*, o.id as order_number 
             FROM feedback f 
             LEFT JOIN orders o ON f.order_id = o.id 
             WHERE f.customer_id = $1 
             ORDER BY f.created_at DESC`,
            [customer_id]
        );
        return result.rows;
    }

    static async getFeedbackById(id) {
        const result = await pool.query('SELECT * FROM feedback WHERE id = $1', [id]);
        return result.rows[0];
    }
}

export default Feedback;