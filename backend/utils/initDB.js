import db from '../config/db.js';

export const initDatabase = async () => {
    const sql = `
    -- Create Database
   
    -- CREATE DATABASE IF NOT EXISTS platform_exam;

    -- USE platform_exam;


    -- Create USERS table
    CREATE TABLE IF NOT EXISTS USERS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        birth_date DATE NOT NULL,
        gender ENUM('male', 'female') NOT NULL,
        Institution VARCHAR(255) NOT NULL,
        filiere VARCHAR(255) NOT NULL,
        user_type ENUM('student', 'teacher') NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_user_type (user_type)
    );
    `;

    console.log('🛠 Creating tables if not exist...');
    db.query(sql, (err) => {
    if (err) {
        console.error(' Error initializing DB: ', err.message);
    } else {
        console.log(' Database initialized');
      };
    } 
    );
};