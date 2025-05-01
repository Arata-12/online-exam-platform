import db from '../config/db.js';
import { executeSqlFile } from '../config/db.js';
export const initDatabase = async () => {


    console.log('🛠 Creating tables if not exist...');

    try {
        await executeSqlFile('./backend/config/exam-platform-sql.sql');
        console.log('Database initialized successfully');
    } catch(err) {
        console.error('Error initializing DB:', err.message);
    }
};
async function createTable(sql) {
    return new Promise((resolve, reject) => {
      db.query(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }