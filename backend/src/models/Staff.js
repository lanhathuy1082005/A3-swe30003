import pool from '../Database.js';


class Staff {

    markedOrderAsReceived(orderId) {}
    markedOrderAsPrepared(orderId) {}
    
    static async createMenuItem(name, price, quantity) {
        const result = await pool.query(
            'INSERT INTO menu (item_name, price, quantity) VALUES ($1, $2, $3) RETURNING id, item_name, price, quantity',
            [name, price, quantity]
        );
        return result.rows[0];
    }

    static async updateMenuItemName(itemId, newName) {
        await pool.query('INSERT INTO menu (item_name) VALUES ($1) WHERE id = $2', [newName, itemId]);
    }

    static async updateMenuItemPrice(itemId, newPrice) {
        await pool.query('INSERT INTO menu (price) VALUES ($1) WHERE id = $2', [newPrice, itemId]);
    }

    static async deleteMenuItem(itemId) {
        await pool.query('DELETE FROM menu WHERE id = $1', [itemId]);
    }
    


}

export default Staff;