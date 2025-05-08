// Teacher logic dashboard
import db from '../config/db.js';
export const getTeacherDashboard = async (req, res) => {
    try {
      const teacherId = req.user.id;
  
      const [teacher] = await db.promise().query(`SELECT first_name FROM users WHERE id = ?`, [teacherId]);
      const [[{ count: totalExams }]] = await db.promise().query(`SELECT COUNT(*) AS count FROM exams WHERE teacher_id = ?`, [teacherId]);
      const [[{ count: totalStudents }]] = await db.promise().query(`
        SELECT COUNT(DISTINCT student_id) AS count FROM student_exams 
        JOIN exams ON exams.id = student_exams.exam_id 
        WHERE exams.teacher_id = ?
      `, [teacherId]);
  
      const [recentExams] = await db.promise().query(`
        SELECT e.title, DATE(e.created_at) AS date,(
          SELECT COUNT(DISTINCT se.student_id)
          FROM student_exams se
          WHERE se.exam_id = e.id
        ) AS students,
        CASE WHEN e.is_active THEN 'Active' ELSE 'Inactive' END AS status
        FROM exams e
        WHERE e.teacher_id = ?
        ORDER BY e.created_at DESC
        LIMIT 5

      `, [teacherId]);
  
      const [recentActivity] = await db.promise().query(`
        SELECT users.first_name AS name, exams.title AS exam, results.total_score AS score, DATE(results.submission_time) AS date 
        FROM results
        JOIN student_exams ON results.student_exam_id = student_exams.id
        JOIN users ON student_exams.student_id = users.id
        JOIN exams ON student_exams.exam_id = exams.id
        WHERE exams.teacher_id = ?
        ORDER BY results.submission_time DESC LIMIT 5
      `, [teacherId]);
  
      res.json({
        success: true,
        name: teacher[0].first_name,
        totalExams,
        totalStudents,
        recentExams,
        recentActivity
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
// GET teacher profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [rows] = await db.promise().query(
      `SELECT first_name, last_name, email, Institution, filiere FROM users WHERE id = ? AND user_type = 'teacher'`,
      [teacherId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.json({ success: true, profile: rows[0] });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE teacher profile
export const updateTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { first_name, last_name, Institution, filiere } = req.body;

    await db.promise().query(
      `UPDATE users SET first_name = ?, last_name = ?, Institution = ?, filiere = ? WHERE id = ? AND user_type = 'teacher'`,
      [first_name, last_name, Institution, filiere, teacherId]
    );

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};
// teacher exams list
export const getTeacherExams = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [exams] = await db.promise().query(
      `SELECT id, title,CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status , target_audience FROM exams WHERE teacher_id = ? ORDER BY created_at DESC`,
      [teacherId]
    );

    res.json({ success: true, exams });
  } catch (err) {
    console.error("Fetch Exams Error:", err);
    res.status(500).json({ success: false, message: "Failed to load exams." });
  }
};

// Get students by exam
export const getExamStudents = async (req, res) => {
  const teacherId = req.user.id;

  const query = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  try {
    const exams = await query(
      `SELECT e.id, e.title FROM EXAMS e WHERE e.teacher_id = ?`,
      [teacherId]
    );

    const examData = [];

    for (const exam of exams) {
      const students = await query(
        `
        SELECT 
          u.first_name, u.last_name,
          se.created_at AS assigned_date,
          r.status
        FROM STUDENT_EXAMS se
        JOIN USERS u ON u.id = se.student_id
        LEFT JOIN RESULTS r ON r.student_exam_id = se.id
        WHERE se.exam_id = ?
        `,
        [exam.id]
      );

      const formattedStudents = students.map(s => ({
        name: `${s.first_name} ${s.last_name}`,
        status: s.status || 'in_progress',
        date: s.assigned_date
          ? new Date(s.assigned_date).toLocaleDateString()
          : '—'
      }));

      examData.push({
        id: exam.id,
        title: exam.title,
        students: formattedStudents
      });
    }

    res.json({ success: true, exams: examData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET teacher exam results
export const getTeacherResults = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Fetch all exams created by this teacher
    const [exams] = await db.promise().query(`
      SELECT id AS exam_id, title AS exam_title
      FROM EXAMS
      WHERE teacher_id = ?
      ORDER BY created_at DESC
    `, [teacherId]);

    const resultData = [];

    for (const exam of exams) {
      // Fetch student results for each exam
      const [students] = await db.promise().query(`
        SELECT 
          CONCAT(U.first_name, ' ', U.last_name) AS full_name,
          R.total_score,
          R.status,
          R.submission_time
        FROM STUDENT_EXAMS SE
        JOIN USERS U ON SE.student_id = U.id
        LEFT JOIN RESULTS R ON R.student_exam_id = SE.id
        WHERE SE.exam_id = ?
      `, [exam.exam_id]);

      const totalStudents = students.length;
      const averageScore = students.reduce((acc, s) => acc + (s.total_score || 0), 0) / (totalStudents || 1);

      resultData.push({
        exam_id: exam.exam_id,
        exam_title: exam.exam_title,
        total_students: totalStudents,
        average_score: averageScore.toFixed(2),
        students
      });
    }

    res.json({ success: true, data: resultData });
  } catch (err) {
    console.error("Results fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

