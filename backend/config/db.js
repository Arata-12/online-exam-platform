// MySQL connection setup
import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';


const db = mysql.createConnection({
  host: process.env.DB_HOST,      
  user: process.env.DB_USER,     
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

export function executeSqlFile(filePath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(filePath);
    const sql = fs.readFileSync(fullPath, 'utf8');
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('SQL execution error:', err.message);
        console.error('Failed statement:', err.sql);
        return reject(err);
      }
      console.log('SQL file executed successfully');
      resolve(results);
    });
  });
}

db.connect((err) => {
  if (err) {
    console.error(' Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log(' Connected to MySQL database .');
  }
});

export default db;