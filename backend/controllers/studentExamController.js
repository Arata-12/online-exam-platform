// Student Exam logic
import db from '../config/db.js';
import { getResultByStudentExamId} from '../models/Result.js';

export const fetchStudentResult = async (req, res) => {
  try {
    const { student_exam_id } = req.params;

    if (!student_exam_id) {
      return res.status(400).json({ message: 'student_exam_id is required' });
    }

    const result = await getResultByStudentExamId(student_exam_id);
    
    if (!result) {
      return res.status(404).json({ message: 'Result not found. Exam might not be submitted yet.' });
    }

    // Add formatted fields
    result.percentage = Math.round((result.total_score / result.total_points) * 100);
    result.duration = `${Math.floor(result.total_time_seconds / 60)}m ${result.total_time_seconds % 60}s`;

    res.status(200).json({
      message: 'Result fetched successfully',
      result
    });

  } catch (err) {
    console.error('Fetch Result Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// show exams of student
export const getStudentExams = async (req, res) => {
  try {
      const student = req.user;
      
      const [exams] = await db.promise().query(`
          SELECT 
              se.id AS student_exam_id,
              e.id AS exam_id,
              e.title,
              SUM(q.points) AS total_points,
              r.total_score,
              r.total_time_seconds,
              r.status,
              r.submission_time
          FROM student_exams se
          JOIN exams e ON se.exam_id = e.id
          LEFT JOIN (
              SELECT exam_id, SUM(points) AS points 
              FROM questions 
              GROUP BY exam_id
          ) q ON e.id = q.exam_id
          LEFT JOIN results r ON se.id = r.student_exam_id
          WHERE se.student_id = ?
          GROUP BY se.id, e.id, e.title, r.total_score, r.total_time_seconds, r.status, r.submission_time
          ORDER BY se.created_at DESC
      `, [student.id]);

      const formattedExams = exams.map(exam => ({
          id: exam.student_exam_id,
          exam_id: exam.exam_id,
          title: exam.title,
          score: exam.total_score !== null ? 
              `${exam.total_score}/${exam.total_points}` : 
              null,
          percentage: exam.total_score !== null ?
              Math.round((exam.total_score / exam.total_points) * 100) :
              null,
          duration: exam.total_time_seconds,
          status: exam.status || 'not_started',
          submission_time: exam.submission_time
      }));

      res.status(200).json(formattedExams);

  } catch (err) {
      console.error('Get Student Exams Error:', err);
      res.status(500).json({ message: 'Server error' });
  }
};

// started exam initialize
export const initiateExam = async (req, res) => {
  try {
    const student = req.user;
    const { examId } = req.params;

    // Check if student is registered for this exam
    const [studentExam] = await db.promise().query(
      `SELECT * FROM student_exams 
      WHERE student_id = ? AND exam_id = ?`,
      [student.id, examId]
    );

    if (!studentExam.length) {
      return res.status(403).json({ 
        message: 'You must join this exam first using an access code' 
      });
    }

    // Check if exam is already in progress
    if (studentExam[0].start_time && !studentExam[0].end_time) {
      return res.status(200).json({
        message: 'Resuming exam',
        student_exam_id: studentExam[0].id,
        exam_id: examId
      });
    }

    //Update start time if not already set
    await db.promise().query(
      `UPDATE student_exams 
      SET start_time = CURRENT_TIMESTAMP 
      WHERE id = ?`,
      [studentExam[0].id]
    );

    await db.promise().query(
      `UPDATE student_exams 
      SET 
        start_time = CURRENT_TIMESTAMP,
        latitude = ?,
        longitude = ?
      WHERE id = ?`,
      [
        parseFloat(req.body.latitude),
        parseFloat(req.body.longitude),
        studentExam[0].id
      ]
    );

    //Get exam details and questions
    const [examDetails] = await db.promise().query(
      `SELECT e.title, e.target_audience, 
      SUM(q.points) AS total_points,
      SUM(q.duration_seconds) AS total_duration
      FROM exams e
      JOIN questions q ON e.id = q.exam_id
      WHERE e.id = ?`,
      [examId]
    );

    res.status(200).json({
      message: 'Exam started successfully',
      student_exam_id: studentExam[0].id,
      exam: {
        id: examId,
        title: examDetails[0].title,
        total_points: examDetails[0].total_points,
        total_duration: examDetails[0].total_duration
      }
    });

  } catch (err) {
    console.error('Start Exam Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// -----------------------------------------------
// Student Start Exam
export const startExam = async (req, res) => {
  try {
    const student = req.user;
    const { access_code } = req.body;

    if (!access_code) {
      return res.status(400).json({ message: 'Access code is required' });
    }

    // Find exam by access code
    const [exam] = await db.promise().query(
      `SELECT * FROM exams WHERE access_link = ? AND is_active = 1`,
      [access_code]
    );

    if (!exam.length) {
      return res.status(404).json({ message: 'Exam not found or inactive' });
    }

    // Check existing student exam
    const [studentExam] = await db.promise().query(
      `SELECT * FROM student_exams 
       WHERE student_id = ? AND exam_id = ?`,
      [student.id, exam[0].id]
    );

    if (!studentExam.length) {
      // Create new student exam
      const [result] = await db.promise().query(
        `INSERT INTO student_exams 
         (student_id, exam_id, start_time) 
         VALUES (?, ?, NOW())`,
        [student.id, exam[0].id]
      );
    }

    res.status(200).json({
      message: 'Exam started successfully',
      exam: {
        id: exam[0].id,
        title: exam[0].title,
        description: exam[0].description
      }
    });

  } catch (err) {
    console.error('Start Exam Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Exam Questions with Duration Calculation
export const getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    // Get total exam duration
    const [duration] = await db.promise().query(
      `SELECT SUM(duration_seconds) AS total_duration 
       FROM questions WHERE exam_id = ?`,
      [examId]
    );

    // Get questions with answers
    const [questions] = await db.promise().query(
      `SELECT q.*, a.id AS answer_id, a.content AS answer_content, a.is_correct
       FROM questions q
       LEFT JOIN answers a ON q.id = a.question_id
       WHERE q.exam_id = ?
       ORDER BY q.order_num`,
      [examId]
    );

    // Format questions
    const formatted = questions.reduce((acc, row) => {
      const existing = acc.find(q => q.id === row.id);
      if (existing) {
        existing.answers.push({
          id: row.answer_id,
          content: row.answer_content,
          is_correct: row.is_correct
        });
      } else {
        acc.push({
          id: row.id,
          content: row.content,
          media_path: row.media_path,
          points: row.points,
          duration: row.duration_seconds,
          question_type: row.question_type,
          answers: row.answer_id ? [{
            id: row.answer_id,
            content: row.answer_content,
            is_correct: row.is_correct
          }] : []
        });
      }
      return acc;
    }, []);

    res.json({
      total_duration: duration[0].total_duration || 0,
      questions: formatted
    });

  } catch (err) {
    console.error('Get Questions Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save Student Answer (with validation)
export const saveAnswer = async (req, res) => {
  try {
    const { student_exam_id, question_id, answer_content, time_taken } = req.body;

    // Fetch the question details (type and points)
    const [question] = await db.promise().query(
      `SELECT question_type, points 
       FROM questions 
       WHERE id = ?`,
      [question_id]
    );
    if (!question.length) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Fetch correct answers from the answers table
    const [correctAnswers] = await db.promise().query(
      `SELECT id, content 
       FROM answers 
       WHERE question_id = ? AND is_correct = 1`,
      [question_id]
    );

    // Determine correctness and earned points
    let is_correct = false;
    let earned_points = 0;

    if (question[0].question_type === 'qcm') {
      // Check if the student's answer ID matches any correct answer ID
      is_correct = correctAnswers.some(ans => ans.id == answer_content);
    } else if (question[0].question_type === 'direct') {
      is_correct = correctAnswers.some(ans => ans.content === answer_content);
    }

    // Assign earned points if correct
    earned_points = is_correct ? question[0].points : 0;

    // Insert/Update the student answer
    await db.promise().query(
      `INSERT INTO student_answers 
       (student_exam_id, question_id, answer_content, is_correct, earned_points, time_taken_seconds)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       answer_content = VALUES(answer_content),
       is_correct = VALUES(is_correct),
       earned_points = VALUES(earned_points),
       time_taken_seconds = VALUES(time_taken_seconds)`,
      [student_exam_id, question_id, answer_content, is_correct, earned_points, time_taken]
    );

    res.status(200).json({ message: 'Answer saved' });

  } catch (err) {
    console.error('Save Answer Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Submit Exam
export const submitExam = async (req, res) => {
  try {
    const { student_exam_id } = req.body;

    // Calculate total score and time
    const [answers] = await db.promise().query(
      `SELECT SUM(earned_points) AS total_score,
              SUM(time_taken_seconds) AS total_time
       FROM student_answers
       JOIN questions ON student_answers.question_id = questions.id
       WHERE student_exam_id = ?`,
      [student_exam_id]
    );

    // Update student exam
    await db.promise().query(
      `UPDATE student_exams 
       SET end_time = NOW()
       WHERE id = ?`,
      [student_exam_id]
    );

    // Create result
    await db.promise().query(
      `INSERT INTO results 
       (student_exam_id, total_score, total_time_seconds, status, submission_time)
       VALUES (?, ?, ?, 'completed', NOW())`,
      [student_exam_id, answers[0].total_score, answers[0].total_time]
    );

    res.json({ message: 'Exam submitted successfully' });

  } catch (err) {
    console.error('Submit Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};