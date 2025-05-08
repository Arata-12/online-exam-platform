// flsah messages
function showFlashMessage(message, type = 'success') {
    const flash = document.getElementById('flash-message');
    flash.textContent = message;
    flash.className = `flash ${type}`;
    flash.classList.remove('hidden');
  
    setTimeout(() => {
      flash.classList.add('hidden');
    }, 3000);
  }

document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let examData = {};
    let timer;
    let studentExamId;
    let examId;
    let totalDuration;
    let questionStartTime;
    const token = localStorage.getItem('token');

    // DOM Elements
    const timerElement = document.getElementById('timer');
    const questionTextElement = document.querySelector('.question-text');
    const choicesElement = document.querySelector('.choices');
    const nextButton = document.querySelector('.next-button');
    const examDescriptionElement = document.getElementById('exam-description-content');
    const examtargetElement = document.getElementById('exam-target');

    // Initialize Exam
    const initExam = async () => {
        try {
            // Get exam parameters from URL
            const urlParams = new URLSearchParams(window.location.search);
            examId = urlParams.get('exam_id');
            studentExamId = urlParams.get('student_exam_id');

            if (!examId || !studentExamId) {
                throw new Error('Invalid exam parameters');
            }

            // Fetch exam data
            const response = await fetch(`http://localhost:3000/api/student/exams/${examId}/questions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to load exam');
            
            const data = await response.json();
            examData = data.questions;
            totalDuration = data.total_duration;

            // Initialize UI
            startTimer(totalDuration);
            showQuestion(currentQuestionIndex);
            loadExamDescription();

        } catch (error) {
            handleError(error);
        }
    };

    // Timer Management
    const startTimer = (duration) => {
        let timeLeft = duration;
        
        const updateTimer = () => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (timeLeft <= 0) submitExam();
            timeLeft--;
        };

        updateTimer();
        timer = setInterval(updateTimer, 1000);
    };

// Updated showQuestion function
const showQuestion = (index) => {
    questionStartTime = Date.now();
    const question = examData[index];
    
    // Clear previous content
    questionTextElement.innerHTML = '';
    choicesElement.innerHTML = '';

    // Question text
    questionTextElement.innerHTML = `
        <span>[ Question ${index + 1} of ${examData.length} ]</span>
        ${question.content}
    `;

    // Answer section
    if (question.question_type === 'direct') {
        choicesElement.innerHTML = `
            <textarea id="direct-answer" 
                     class="direct-input" 
                     placeholder="Type your answer here..."
                     rows="4"></textarea>
        `;
    } else {
        choicesElement.innerHTML = question.answers.map((answer, i) => `
            <li>
                <label>
                    <input type="radio" name="question" value="${answer.id}">
                    ${String.fromCharCode(65 + i)}. ${answer.content}
                </label>
            </li>
        `).join('');
    }

    // Update button text
    nextButton.textContent = index === examData.length - 1 ? 'Submit Exam' : 'Next Question';
};

// Updated saveAnswer function
const saveAnswer = async () => {
    const question = examData[currentQuestionIndex];
    let answerContent = '';

    if (question.question_type === 'direct') {
        const textarea = document.getElementById('direct-answer');
        answerContent = textarea.value;
        
        if (!answerContent.trim()) {
            showFlashMessage('Please write your answer before continuing', 'error');
            return false;
        }
    } else {
        const selected = document.querySelector('input[name="question"]:checked');
        if (!selected) {
            showFlashMessage('Please select an answer before continuing', 'error');
            return false;
        }
        answerContent = selected.value;
    }

    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    
    try {
        const response = await fetch('http://localhost:3000/api/student/saveanswer', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_exam_id: studentExamId,
                question_id: question.id,
                answer_content: answerContent,
                time_taken: timeTaken
            })
        });

        if (!response.ok) throw new Error('Failed to save answer');
        return true;

    } catch (error) {
        showFlashMessage(error.message || 'Failed to save answer', 'error');
        return false;
    }
};

// Updated navigation handler
nextButton.addEventListener('click', async () => {
    try {
        const saved = await saveAnswer();
        if (!saved) return;
        
        if (currentQuestionIndex < examData.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            await submitExam();
        }
    } catch (error) {
        handleError(error);
    }
});

    // Submit Exam
    const submitExam = async () => {
        clearInterval(timer);
        try {
            const response = await fetch('http://localhost:3000/api/student/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ student_exam_id: studentExamId })
            });

            if (!response.ok) throw new Error('Submission failed');
            showFlashMessage('Exam submitted successfully!', 'success');
            window.removeEventListener('beforeunload', handleBeforeUnload);
            setTimeout(() => {
                window.location.href = `resultstudent.html?exam_id=${examId}`;
            },2000)
            
        } catch (error) {
            handleError(error);
        }
        const handleBeforeUnload = (e) => {
            if (timer) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        
        // Update event listener initialization
        window.addEventListener('beforeunload', handleBeforeUnload);
    };

    // Load Exam Description and group
    const loadExamDescription = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/exams/${examId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const exam = await response.json();
                examDescriptionElement.textContent = exam.description;
                examtargetElement.textContent = exam.target_audience;

            }
        } catch (error) {
            console.error('Failed to load exam description:', error);
        }
    };

    // Error Handling
    const handleError = (error) => {
        console.error('Exam Error:', error);
        showFlashMessage(error.message || 'An error occurred. Please try again.');
        window.location.href = 'student-dashboard.html';
    };

    // Start the exam
    initExam();

    // Handle window close
    window.addEventListener('beforeunload', (e) => {
        if (timer) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});