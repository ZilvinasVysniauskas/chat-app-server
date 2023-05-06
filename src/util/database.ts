import mysql, { Pool } from 'mysql2';
import util from 'util';

// const mySqlPool: Pool = mysql.createPool({
//     connectionLimit: 10,
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'database_user',
//     password: process.env.DB_PASSWORD || 'database_password',
//     database: process.env.DB_NAME || 'database_name',
// });

const mySqlPool: Pool = mysql.createPool({
    connectionLimit: 10,
    host: 'chat-app-database-maria.cuj8xpn3teqi.eu-central-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Admin12345',
    database: 'chat_app',
});


mySqlPool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

const mySqlPromise = mySqlPool.promise();

export default mySqlPromise;