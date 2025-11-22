import pool from '../Database.js';



class User {
    
    static async getRoleIdByRoleName(name){
        const role = await pool.query('SELECT id FROM roles WHERE name = $1', [name]);
        return role.rows[0].id;
    }

    static async getUserbyEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }
    
    static async createUser(email, name, passwordHash, roleId) {
        await pool.query('INSERT INTO users (email, name, password_hash, role_id) VALUES ($1, $2, $3, $4)', [email, name, passwordHash, roleId]);
    }

    static async getUserPermsByRoleId(roleId){
        const result = await pool.query('SELECT p.name FROM roles_permissions rp JOIN permissions p ON rp.permission_id = p.id WHERE rp.role_id = $1', [roleId]);
        return result.rows;
    }



}

export default User;