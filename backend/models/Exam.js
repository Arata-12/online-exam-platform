// Exam model queries
import db from '../config/db.js';

export const insertExam = (exam) => {
  return new Promise((resolve, reject) => {
    const { title, description, target_audience, teacher_id, access_link } = exam;
    const sql = `
      INSERT INTO exams (title, description, target_audience, teacher_id, access_link)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [title, description, target_audience, teacher_id, access_link], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};
// added get exam info
export const getExamById = (examId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, title, description, target_audience, access_link, teacher_id
      FROM exams
      WHERE id = ?
    `;
    db.query(sql, [examId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};


export const updateExam = (examId, updatedData) => {
  return new Promise((resolve, reject) => {
    const { title, description, target_audience } = updatedData;
    const sql = `
      UPDATE \`exams\`
      SET \`title\` = ?, \`description\` = ?, \`target_audience\` = ?
      WHERE \`id\` = ?
    `;
    db.query(sql, [title, description, target_audience, examId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const deleteExam = (examId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM \`exams\`
      WHERE \`id\` = ?
    `;
    db.query(sql, [examId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
