-- Create Database
CREATE DATABASE IF NOT EXISTS platform_exam;
USE platform_exam;

-- Create USERS table
CREATE TABLE IF NOT EXISTS USERS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    Institution VARCHAR(255) NOT NULL,
    filiere VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'teacher') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- Create EXAMS table
CREATE TABLE IF NOT EXISTS EXAMS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_audience VARCHAR(255) NOT NULL,
    access_link VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES USERS(id) ON DELETE CASCADE,
    INDEX idx_teacher (teacher_id),
    INDEX idx_access_link (access_link)
);

-- Create QUESTIONS table
CREATE TABLE IF NOT EXISTS QUESTIONS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    question_type ENUM('direct', 'qcm') NOT NULL,
    content TEXT NOT NULL,
    media_path VARCHAR(255),
    points FLOAT NOT NULL,
    duration_seconds INT NOT NULL,
    order_num INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES EXAMS(id) ON DELETE CASCADE,
    INDEX idx_exam (exam_id)
);

-- Create ANSWERS table
CREATE TABLE IF NOT EXISTS ANSWERS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    content TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    tolerance_rate FLOAT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES QUESTIONS(id) ON DELETE CASCADE,
    INDEX idx_question (question_id)
);

-- Create STUDENT_EXAMS table
CREATE TABLE IF NOT EXISTS STUDENT_EXAMS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    start_time DATETIME NULL,
    end_time DATETIME,
    latitude FLOAT,
    longitude FLOAT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES USERS(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES EXAMS(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_exam (exam_id),
    UNIQUE KEY unique_student_exam (student_id, exam_id)
);

-- Create STUDENT_ANSWERS table
CREATE TABLE IF NOT EXISTS STUDENT_ANSWERS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_exam_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_content TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    earned_points FLOAT DEFAULT 0,
    time_taken_seconds INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_exam_id) REFERENCES STUDENT_EXAMS(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES QUESTIONS(id) ON DELETE CASCADE,
    INDEX idx_student_exam (student_exam_id),
    INDEX idx_question (question_id),
    UNIQUE KEY unique_student_exam_question (student_exam_id, question_id)
);

-- Create RESULTS table
CREATE TABLE IF NOT EXISTS RESULTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_exam_id INT NOT NULL,
    total_score FLOAT NOT NULL,
    total_time_seconds INT,
    status ENUM('completed', 'in_progress') DEFAULT 'in_progress',
    submission_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_exam_id) REFERENCES STUDENT_EXAMS(id) ON DELETE CASCADE,
    INDEX idx_student_exam (student_exam_id),
    UNIQUE KEY unique_student_exam_result (student_exam_id)
);
