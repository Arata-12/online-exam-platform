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
// -----------------------------------------------------------------------
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-target');
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
    
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
        
      });
    });
    
// ------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const studentExamId = urlParams.get('exam_id');
    
    // DOM Elements
    const elements = {
        studentName: document.querySelector('.left-info h3'),
        examTitle: document.querySelector('.left-info p:first-of-type'),
        points: document.querySelector('.left-info p:nth-of-type(2)'),
        duration: document.querySelector('.left-info p:nth-of-type(3)'),
        started: document.querySelector('.left-info p:nth-of-type(4)'),
        finished: document.querySelector('.left-info p:nth-of-type(5)'),
        percentage: document.querySelector('.percentage'),
        progressCircle: document.querySelector('.circle-progress'),
        tabs: document.querySelectorAll('.tab'),
        tabContents: document.querySelectorAll('.tab-content')
    };
    // Fetch Result Data
    const fetchResultData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/student/result/${studentExamId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to load result');
            
            const { result } = await response.json();
            populateResultData(result);
            setupLogout();

        } catch (error) {
            console.error('Error:', error);
            showFlashMessage('Failed to load result data', 'error');
            setTimeout(() => {
                window.location.href = 'student-dashboard.html';
            }, 2000);
        };
    };

    // Populate Result Data
    const populateResultData = (result) => {
        // Header Section with null checks
        safeTextContent(elements.studentName, result.student_name);
        safeHTML(elements.examTitle, `<strong><i class="fa-solid fa-file-invoice"></i></strong> ${result.exam_title}`);
        safeTextContent(elements.points, `Points: ${result.total_score} / ${result.total_points}`);
        safeTextContent(elements.duration, `Duration: ${result.duration}`);
        safeTextContent(elements.started, `Started: ${formatDate(result.start_time)}`);
        safeTextContent(elements.finished, `Finished: ${formatDate(result.submission_time)}`);

        // Progress Circle
        if (elements.percentage && elements.progressCircle) {
            elements.percentage.textContent = `${result.percentage}%`;
            elements.progressCircle.style.strokeDasharray = `${result.percentage}, 100`;
        }

        // Questions Section
        populateQuestions('all', result.answers);
        populateQuestions('correct', result.answers.filter(a => a.is_correct));
        populateQuestions('incorrect', result.answers.filter(a => !a.is_correct));
    };

    // Helper functions
    const safeTextContent = (element, text) => {
        if (element) element.textContent = text;
    };

    const safeHTML = (element, html) => {
        if (element) element.innerHTML = html;
    };

    const populateQuestions = (targetId, answers) => {
        const container = document.getElementById(targetId);
        if (!container) return;

        container.innerHTML = answers.map((answer, index) => `
            <div class="question-card">
                <p class="question-text">Q${index + 1}: ${answer.question_content}</p>
                <div class="answers">${renderAnswerOptions(answer)}</div>
                <p class="points-earned">Points: ${answer.earned_points}</p>
            </div>
        `).join('');
    };
    // Helper Functions
    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Updated renderAnswerOptions function
const renderAnswerOptions = (answer, showCorrect = false) => {
    const isCorrect = answer.is_correct;
    if (answer.question_type === 'direct') {
      return `
        <div class="answer-option ${answer.is_correct ? 'correct' : 'incorrect-red'}">
          ${answer.answer_content}
          <span class="${isCorrect ? 'checkmark' : 'checkmark-red'} ">${answer.is_correct ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-x"></i>'}</span>
          ${showCorrect ? ` 
          <div class="correct-answer-hint">
            ${answer.correct_answer}
          </div>` : ''}
        </div>
      `;
    }
  
    // For QCM questions without options list
    return `
      <div class="answer-option ${answer.is_correct ? 'correct' : 'incorrect-red'}">
         ${answer.answer_content}
        <span class="${isCorrect ? 'checkmark' : 'checkmark-red'}">${answer.is_correct ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-x"></i>'}</span>
        ${showCorrect ? `
        <div class="correct-answer-hint">
          ${answer.answer_content}
        </div>` : ''}
      </div>
    `;
  };
    // Logout Handler
    const setupLogout = () => {
        document.getElementById('logout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    };

    // Initialize
    fetchResultData();
});