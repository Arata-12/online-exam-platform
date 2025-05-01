import db from '../config/db.js';

// Find student_exam by student_id and exam_id
export const findStudentExam = (student_id, exam_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM \`student_exams\`
      WHERE \`student_id\` = ? AND \`exam_id\` = ?
    `;
    db.query(sql, [student_id, exam_id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

// Insert new student_exam (join an exam)
export const insertStudentExam = (student_id, exam_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO \`student_exams\` (\`student_id\`, \`exam_id\`, \`start_time\`)
      VALUES (?, ?, NULL)
    `;
    db.query(sql, [student_id, exam_id], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Find exam by access_code
export const findExamByAccessCode = (access_code) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM \`exams\`
      WHERE \`access_link\` = ? AND \`is_active\` = 1
    `;
    db.query(sql, [access_code], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};
