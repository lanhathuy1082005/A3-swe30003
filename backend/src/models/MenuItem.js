import pool from '../Database.js';

class MenuItem {
    async getAllMenuItems() {
        const res = await pool.query('SELECT * FROM menu');
        return res.rows;
    }
}

export default MenuItem;