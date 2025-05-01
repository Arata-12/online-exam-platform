// Result model queries
import db from '../config/db.js';

// Insert a new result after exam submission
export const insertResult = (student_exam_id, total_score, total_time_seconds, status, submission_time) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO \`results\`
      (\`student_exam_id\`, \`total_score\`, \`total_time_seconds\`, \`status\`, \`submission_time\`)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [student_exam_id, total_score, total_time_seconds, status, submission_time], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Get final result of a student_exam
export const getResultByStudentExamId = (student_exam_id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM \`results\`
        WHERE \`student_exam_id\` = ?
      `;
      db.query(sql, [student_exam_id], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  };