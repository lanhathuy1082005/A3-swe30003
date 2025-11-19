import MenuItem from './MenuItem.js';
import pool from '../Database.js';

class OrderItem{

    static async createOrderItem(itemId, orderId, quantity) {
        try {
        const priceResult = await pool.query('SELECT price FROM menu WHERE id = $1', [itemId]); 

        if (priceResult.rows.length === 0) {
            throw new Error('Menu item not found');
        }

        const price = priceResult.rows[0].price;

        const item =  await pool.query('INSERT INTO order_items (item_id, order_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *', [itemId, orderId, quantity, price, price * quantity]);
        return item.rows[0];
        } catch (err) {
            console.error('Error creating order item:', err);
            throw err;
        }
    }

}

export default OrderItem;