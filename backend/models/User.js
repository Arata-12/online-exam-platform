// User model queries
import db from '../config/db.js';

// Find user by email
export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    db.query(query, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};

// Create new user
export const createUser = (user) => {
  return new Promise((resolve, reject) => {
    const {
      email,
      password,
      first_name,
      last_name,
      birth_date,
      gender,
      Institution,
      filiere,
      user_type
    } = user;

    const query = `
      INSERT INTO users 
      (email, password, first_name, last_name, birth_date, gender, Institution, filiere, user_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [email, password, first_name, last_name, birth_date, gender, Institution, filiere, user_type],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};
