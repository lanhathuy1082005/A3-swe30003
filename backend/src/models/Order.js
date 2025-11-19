import pool from '../Database.js';

class Order {

    static async createOrder(customer_id, final_price, payment_method) {
    const order = await pool.query('INSERT INTO orders (customer_id, final_price, payment_method) VALUES ($1, $2, $3) RETURNING *'
        ,[customer_id, final_price, payment_method]);
    return order.rows[0];
    }

    static async updateOrderFinalPrice(orderId, finalPrice) {
    const result = await pool.query(
    `UPDATE orders 
     SET final_price = $1 
     WHERE id = $2 
     RETURNING *`,
    [finalPrice, orderId]
    );
    return result.rows[0];
    }

    static async updateOrderStatus(orderId, status) {
    const result = await pool.query(
    `UPDATE orders 
     SET order_status = $1 
     WHERE id = $2 
     RETURNING *`,
    [status, orderId]
    );
    return result.rows[0];
    }



}





export default Order;