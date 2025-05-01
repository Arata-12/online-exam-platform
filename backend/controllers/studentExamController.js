// Student Exam logic

import { findExamByAccessCode, findStudentExam, insertStudentExam } from '../models/StudentExam.js';
import { saveStudentAnswer } from '../models/StudentAnswer.js';
import db from '../config/db.js';
import { insertResult ,getResultByStudentExamId} from '../models/Result.js';
// Student Start Exam (join by access code)
export const startExam = async (req, res) => {
  try {
    const student = req.user; // from verifyToken
    const { access_code } = req.body;

    if (!access_code) {
      return res.status(400).json({ message: 'Access code is required' });
    }

    // 1. Find the exam by access code
    const exam = await findExamByAccessCode(access_code);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found or not active' });
    }

    // 2. Check if student already linked to this exam
    const studentExam = await findStudentExam(student.id, exam.id);
    if (!studentExam) {
      // If not linked, insert record
      await insertStudentExam(student.id, exam.id);
    }

    res.status(200).json({
      message: 'Exam linked successfully',
      exam: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        target_audience: exam.target_audience
      }
    });
  } catch (err) {
    console.error('Start Exam Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save Student Answers
export const saveAnswer = async (req, res) => {
    try {
      const student = req.user; 
      const { student_exam_id, question_id, answer_content, is_correct, earned_points, time_taken_seconds } = req.body;
  
      if (!student_exam_id || !question_id || answer_content === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      await saveStudentAnswer(student_exam_id, question_id, answer_content, is_correct, earned_points, time_taken_seconds);
  
      res.status(201).json({ message: 'Answer saved successfully' });
    } catch (err) {
      console.error('Save Answer Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  // Submit Exam and Calculate Result
export const submitExam = async (req, res) => {
    try {
      const student = req.user; // from verifyToken
      const { student_exam_id } = req.body;
  
      if (!student_exam_id) {
        return res.status(400).json({ message: 'student_exam_id is required' });
      }
  
      // 1. Get all student's answers for this exam
      const sql = `
        SELECT \`earned_points\`, \`time_taken_seconds\`
        FROM \`student_answers\`
        WHERE \`student_exam_id\` = ?
      `;
      const [answers] = await db.promise().query(sql, [student_exam_id]);
  
      if (!answers.length) {
        return res.status(400).json({ message: 'No answers found for this exam.' });
      }
  
      // 2. Calculate total score and total time
      let total_score = 0;
      let total_time_seconds = 0;
      answers.forEach(ans => {
        total_score += ans.earned_points;
        total_time_seconds += ans.time_taken_seconds;
      });
  
      // 3. Insert into results table
      const submission_time = new Date();
      await insertResult(student_exam_id, total_score, total_time_seconds, 'completed', submission_time);
  
      res.status(200).json({
        message: 'Exam submitted successfully',
        total_score,
        total_time_seconds
      });
    } catch (err) {
      console.error('Submit Exam Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const fetchStudentResult = async (req, res) => {
    try {
      const student = req.user;
      const { student_exam_id } = req.params;
  
      if (!student_exam_id) {
        return res.status(400).json({ message: 'student_exam_id is required' });
      }
  
      const result = await getResultByStudentExamId(student_exam_id);
      if (!result) {
        return res.status(404).json({ message: 'Result not found. Exam might not be submitted yet.' });
      }
  
      res.status(200).json({
        message: 'Result fetched successfully',
        result
      });
    } catch (err) {
      console.error('Fetch Result Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };