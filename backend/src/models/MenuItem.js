import pool from '../Database.js';

class MenuItem {
  static async getAllMenuItems() {
    try {
      const menu = await pool.query('SELECT * FROM menu');
      return menu.rows; // return the actual rows
    } catch (err) {
      console.error('Error fetching menu items:', err);
      throw err;
    }
  }

  static async getMenuQuantityById(itemId){
    const result = await pool.query(
      `SELECT quantity FROM menu WHERE id = $1`,
      [itemId]
    );
    return result.rows[0];
  }

  static async updateMenuItemQuantity(itemId, newQuantity) {
    const result = await pool.query(
      `UPDATE menu 
       SET quantity = $1 
       WHERE id = $2 
       RETURNING *`,
      [newQuantity, itemId]
    );
    return result.rows[0];
  }

}

export default MenuItem;