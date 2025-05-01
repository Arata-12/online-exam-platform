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