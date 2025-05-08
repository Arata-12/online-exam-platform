import db from '../config/db.js';
export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [rows] = await db.promise().query(
      `SELECT first_name, last_name, email, Institution, filiere 
       FROM users 
       WHERE id = ? AND user_type = 'student'`,
      [studentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Student profile not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      profile: rows[0] 
    });

  } catch (err) {
    console.error("Profile fetch error:", err);
    console.log("Error details:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { first_name, last_name, Institution, filiere } = req.body;

    const [result] = await db.promise().query(
      `UPDATE users 
       SET first_name = ?, last_name = ?, Institution = ?, filiere = ?
       WHERE id = ? AND user_type = 'student'`,
      [first_name, last_name, Institution, filiere, studentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Student profile not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Profile updated successfully" 
    });

  } catch (err) {
    console.error("Profile update error:", err);
    console.log("Error details:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update profile" 
    });
  }
};