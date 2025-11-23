import pool from '../Database.js'

class Promotion {

    static async CreateGlobalDiscountPromotion(type, amount, start_date, end_date, active){
        const result = await pool.query(
            "INSERT INTO promotion (type, amount, start_date, end_date, active) VALUES ($1,$2,$3,$4,$5) RETURNING *",
            [type, amount, start_date, end_date, active]
        );
        return result.rows[0];
    }

    static async CreateSpecificDiscountPromotion(type, amount, menu_id, start_date, end_date, active){
        const result = await pool.query(
            "INSERT INTO promotion (type, amount, menu_id, start_date, end_date, active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [type, amount, menu_id, start_date, end_date, active]
        );
        return result.rows[0];
    }
    
    static async CreateGlobalBogoPromotion(type, min_quantity, free_quantity, start_date, end_date, active){
        const result = await pool.query(
            "INSERT INTO promotion (type, min_quantity, free_quantity, start_date, end_date, active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [type, min_quantity, free_quantity, start_date, end_date, active]
        );
        return result.rows[0];
    }

    static async CreateSpecificBogoPromotion(type, menu_id, min_quantity, free_quantity, start_date, end_date, active){
        const result = await pool.query(
            "INSERT INTO promotion (type, menu_id, min_quantity, free_quantity, start_date, end_date, active) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
            [type, menu_id, min_quantity, free_quantity, start_date, end_date, active]
        );
        return result.rows[0];
    }

    static async getAllPromotion(){
        const result = await pool.query("SELECT * FROM promotion ORDER BY id DESC");
        return result.rows;
    }

    static async getPromotionById(id){
        const result = await pool.query("SELECT * FROM promotion WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async updatePromotionActive(id, active){
        const result = await pool.query(
            "UPDATE promotion SET active = $1 WHERE id = $2 RETURNING *",
            [active, id]
        );
        return result.rows[0];
    }

    static async deletePromotionById(id){
        await pool.query("DELETE FROM promotion WHERE id = $1", [id]);
    }
}

export default Promotion;