// Result model queries
import db from '../config/db.js';

// Get final result of a student_exam
export const getResultByStudentExamId = (student_exam_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        MAX(CONCAT(u.first_name, ' ', u.last_name)) AS student_name,
        MAX(e.title) AS exam_title,
        MAX(r.total_score) AS total_score,
        (SELECT SUM(points) FROM questions WHERE exam_id = e.id) AS total_points,
        MAX(r.total_time_seconds) AS total_time_seconds,
        MAX(se.start_time) AS start_time,
        MAX(se.end_time) AS submission_time,
        sa.question_id,
        MAX(
            CASE 
              WHEN q.question_type = 'qcm' THEN ans.content 
              ELSE sa.answer_content 
            END
          ) AS answer_content,
        MAX(sa.is_correct) AS is_correct,
        MAX(sa.earned_points) AS earned_points,
        MAX(q.content) AS question_content,
        MAX(q.question_type) AS question_type,
        MAX(a.content) AS correct_answer_content
      FROM results r
      JOIN student_exams se ON r.student_exam_id = se.id
      JOIN users u ON se.student_id = u.id
      JOIN exams e ON se.exam_id = e.id
      JOIN student_answers sa ON r.student_exam_id = sa.student_exam_id
      JOIN questions q ON sa.question_id = q.id
      LEFT JOIN answers a ON q.id = a.question_id AND a.is_correct = 1
      LEFT JOIN answers ans ON ans.id = sa.answer_content AND q.question_type = 'qcm'
      WHERE r.student_exam_id = ?
      GROUP BY sa.question_id
    `;
    
    db.query(sql, [student_exam_id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      const structured = {
        student_name: results[0].student_name,
        exam_title: results[0].exam_title,
        total_score: results[0].total_score,
        total_points: results[0].total_points,
        total_time_seconds: results[0].total_time_seconds,
        start_time: results[0].start_time,
        submission_time: results[0].submission_time,
        answers: results.map(row => ({
          question_id: row.question_id,
          question_content: row.question_content,
          answer_content: row.answer_content,
          is_correct: row.is_correct,
          earned_points: row.earned_points,
          correct_answer: row.correct_answer_content,
          question_type: row.question_type
        }))
      };

      resolve(structured);
    });
  });
};