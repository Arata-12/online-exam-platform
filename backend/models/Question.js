// Question model queries

import db from '../config/db.js';

// Insert a question
export const insertQuestion = (question) => {
  return new Promise((resolve, reject) => {
    const {
      exam_id, question_type, content, media_path, points, duration_seconds, order_num
    } = question;
    const sql = `
      INSERT INTO \`questions\` 
      (\`exam_id\`, \`question_type\`, \`content\`, \`media_path\`, \`points\`, \`duration_seconds\`, \`order_num\`)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [exam_id, question_type, content, media_path, points, duration_seconds, order_num], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Insert an answer (direct OR QCM option)
export const insertAnswer = (answer) => {
  return new Promise((resolve, reject) => {
    const {
      question_id, content, is_correct, tolerance_rate
    } = answer;
    const sql = `
      INSERT INTO \`answers\`
      (\`question_id\`, \`content\`, \`is_correct\`, \`tolerance_rate\`)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [question_id, content, is_correct, tolerance_rate], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Update a question
export const updateQuestion = (questionId, updatedData) => {
  return new Promise((resolve, reject) => {
    const { content, points, duration_seconds } = updatedData;
    const sql = `
      UPDATE \`questions\`
      SET \`content\` = ?, \`points\` = ?, \`duration_seconds\` = ?
      WHERE \`id\` = ?
    `;
    db.query(sql, [content, points, duration_seconds, questionId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Delete a question
export const deleteQuestion = (questionId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM \`questions\`
      WHERE \`id\` = ?
    `;
    db.query(sql, [questionId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
