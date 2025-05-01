import db from '../config/db.js';

// Save a student's answer
export const saveStudentAnswer = (student_exam_id, question_id, answer_content, is_correct, earned_points, time_taken_seconds) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO \`student_answers\`
      (\`student_exam_id\`, \`question_id\`, \`answer_content\`, \`is_correct\`, \`earned_points\`, \`time_taken_seconds\`)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [student_exam_id, question_id, answer_content, is_correct, earned_points, time_taken_seconds], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};
