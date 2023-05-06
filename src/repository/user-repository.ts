import mySqlPromisePool from '../util/database';
import User from '../models/user';

//todo handle errors when user not found
export const findUserById = async (id: string): Promise<User | null> => {
    try {
        const [rows] = await mySqlPromisePool.query(`SELECT * FROM users WHERE id = ?`, [id]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0] as User;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (userData: User): Promise<User> => {
    try {
        const [result] = await mySqlPromisePool.query('INSERT INTO users SET ?', userData);
        const newUser = { ...userData, id: result.insertId } as User;
        return newUser;
    } catch (error) {
        throw error;
    }
};
