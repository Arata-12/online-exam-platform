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
// Fetch all questions for an exam
export const getQuestionsByExamId = (examId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, content, points, order_num FROM questions WHERE exam_id = ?`;
    db.query(sql, [examId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
// fetch question with answers
export const getQuestionWithAnswers = (questionId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.id AS question_id, q.content AS question_content, q.points, q.duration_seconds,
             q.question_type,
             a.id AS answer_id, a.content AS answer_content, a.is_correct, a.tolerance_rate
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
      WHERE q.id = ?
    `;
    db.query(sql, [questionId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      const question = {
        id: results[0].question_id,
        content: results[0].question_content,
        points: results[0].points,
        duration_seconds: results[0].duration_seconds,
        question_type: results[0].question_type,
        answers: []
      };

      results.forEach(row => {
        if (row.answer_id) {
          question.answers.push({
            id: row.answer_id,
            content: row.answer_content,
            is_correct: row.is_correct,
            tolerance_rate: row.tolerance_rate
          });
        }
      });

      resolve(question);
    });
  });
};
