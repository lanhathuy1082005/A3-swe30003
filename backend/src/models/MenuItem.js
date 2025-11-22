import pool from '../Database.js';

class MenuItem {
  static async getAllMenuItems() {
    const result = await pool.query('SELECT * FROM menu');
    return result.rows; // return the actual row
  }

  static async addMenuItem(itemName, price, quantity){
    const result = await pool.query(
      `INSERT INTO menu (item_name, price, quantity) VALUES ($1,$2,$3) RETURNING *`,
      [itemName,price,quantity]
    );
    return result.rows[0];
  }

  static async updateMenuItemById(itemId, itemName, price, quantity){
    const result = await pool.query(
    `UPDATE menu
    SET item_name = $1,
    price = $2,
    quantity = $3
    WHERE id = $4 RETURNING *`,
    [itemName,price,quantity,itemId]);
    return result.rows[0];
  }

  static async removeMenuItemById(itemId){
    await pool.query(`DELETE FROM menu WHERE id = $1`,[itemId]);
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