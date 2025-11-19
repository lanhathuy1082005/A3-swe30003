import pool from '../Database.js';
import User from "./User.js";

class Customer {

   static async create(email, name, password) {
        const result = await pool.query(
            'INSERT INTO customers (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name',
            [email, name, password]
        );
        return result.rows[0];
    }

    static async viewOrderHistory(id){
        const result = await pool.query(
            'SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC',
            [id]
        );
        return result.rows;
    }

    static async addLoyaltyPoints(points){
        const result = await pool.query(
            'UPDATE customers SET loyalty_points = loyalty_points + $1 RETURNING loyalty_points',
            [points]
        );
        return result.rows[0].loyalty_points;
    }

    static async redeemLoyaltyPoints(points){
        const result = await pool.query(
            'UPDATE customers SET loyalty_points = loyalty_points - $1 RETURNING loyalty_points',
            [points]
        );
        return result.rows[0].loyalty_points;
    }


}

export default Customer;