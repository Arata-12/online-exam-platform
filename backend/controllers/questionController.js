// Question logic
import db from '../config/db.js';
import { insertQuestion, insertAnswer , updateQuestion, deleteQuestion, getQuestionsByExamId, getQuestionWithAnswers} from '../models/Question.js';

// Add a Question to an Exam
export const addQuestion = async (req, res) => {
  try {
    const { examId } = req.params;

    const {
      question_type,
      content,
      points,
      duration_seconds,
      answer_content,
      tolerance_rate = 0,
      options = "[]"
    } = req.body;
    const media_path = req.file ? req.file.path : null;
    let parsedOptions = [];
    if (question_type === 'qcm') {
      try {
        parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
      } catch (error) {
        return res.status(400).json({ message: 'Invalid options format.' });
      }
    }

    // Validation
    if (!question_type || !content || !points || !duration_seconds) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    if (!['direct', 'qcm'].includes(question_type)) {
      return res.status(400).json({ message: 'Invalid question type.' });
    }

    // Calculate next order number
    const getNextOrderNum = (examId) => {
      return new Promise((resolve, reject) => {
        const sql = `SELECT MAX(order_num) AS max_order FROM questions WHERE exam_id = ?`;
        db.query(sql, [examId], (err, results) => {
          if (err) return reject(err);
          const nextOrder = results[0].max_order !== null ? results[0].max_order + 1 : 1;
          resolve(nextOrder);
        });
      });
    };

    const order_num = await getNextOrderNum(examId);

    // Insert Question
    const questionId = await insertQuestion({
      exam_id: examId,
      question_type,
      content,
      media_path,
      points,
      duration_seconds,
      order_num
    });

    // Insert Answers
    if (question_type === 'direct') {
      if (!answer_content) {
        return res.status(400).json({ message: 'Answer content is required for direct question.' });
      }
      await insertAnswer({
        question_id: questionId,
        content: answer_content,
        is_correct: true,
        tolerance_rate
      });
    } else if (question_type === 'qcm') {
      if (!parsedOptions.length) {
        return res.status(400).json({ message: 'At least one option must be provided for QCM.' });
      }
      for (const option of parsedOptions) {
        await insertAnswer({
          question_id: questionId,
          content: option.content,
          is_correct: !!option.is_correct,
          tolerance_rate: 0
        });
      }
    }

    res.status(201).json({
      message: 'Question added successfully',
      question_id: questionId
    });

  } catch (err) {
    console.error('Add Question Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// -----------------------------------
export const getExamQuestions = async (req, res) => {
  const { examId } = req.params;

  try {
    const questions = await getQuestionsByExamId(examId);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error });
  }
};
// -----------------------------------------------------
// Get Question with Answers
export const fetchQuestionWithAnswers = async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await getQuestionWithAnswers(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    else res.json(question);
    
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// -----------------------------------------------------
// Update a Question
export const updateQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content, points, duration_seconds } = req.body;

    if (!content || !points || !duration_seconds) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await updateQuestion(questionId, { content, points, duration_seconds });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question updated successfully' });
  } catch (err) {
    console.error('Update Question Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a Question
export const deleteQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    const result = await deleteQuestion(questionId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Delete Question Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
