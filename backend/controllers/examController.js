// Exam logic
import { insertExam ,updateExam, deleteExam} from '../models/Exam.js';
import { nanoid } from 'nanoid'; // To generate a unique access code

export const createExam = async (req, res) => {
  try {
    const { title, description, target_audience } = req.body;
    const teacher = req.user; // from authMiddleware (decoded JWT)

    // Validation
    if (!title || !description || !target_audience) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (teacher.user_type !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create exams' });
    }

    // Generate unique access code
    const access_link = nanoid(10); // example: "A1B2C3D4E5"

    // Insert exam
    const examId = await insertExam({
      title,
      description,
      target_audience,
      teacher_id: teacher.id,
      access_link
    });

    res.status(201).json({
      message: 'Exam created successfully',
      exam: {
        id: examId,
        title,
        access_link
      }
    });
  } catch (err) {
    console.error('Create Exam Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateExamById = async (req, res) => {
  try {
    const { examId } = req.params;
    const { title, description, target_audience } = req.body;

    if (!title || !description || !target_audience) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await updateExam(examId, { title, description, target_audience });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json({ message: '✅ Exam updated successfully' });
  } catch (err) {
    console.error('Update Exam Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteExamById = async (req, res) => {
  try {
    const { examId } = req.params;

    const result = await deleteExam(examId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json({ message: '✅ Exam deleted successfully' });
  } catch (err) {
    console.error('Delete Exam Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
