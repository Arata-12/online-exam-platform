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
//redirect to result page
document.addEventListener("DOMContentLoaded", function () {
  const retakeButtons = document.querySelectorAll(".btn.danger");
  retakeButtons.forEach(button => {
      button.addEventListener("click", function () {
          window.location.href = "resultstudent.html";
      });
  });
});

// ----------------------------------------------------------------------------------------------
// fetch api to link exam
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const linkExamBtn = document.getElementById('link-exam-btn');
  const examCodeInput = document.getElementById('exam-code');
  const logoutBtn = document.getElementById('logout');
  const userDropdownToggle = document.getElementById('userDropdownToggle');
  const userDropdown = document.getElementById('userDropdown');

  // Toggle User Dropdown
  if (userDropdownToggle) {
      userDropdownToggle.addEventListener('click', () => {
          userDropdown.classList.toggle('show');
      });
  }

  // Close Dropdown on Outside Click
  window.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
          userDropdown.classList.remove('show');
      }
  });

  // Logout Handler
  if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('token');
          window.location.href = 'login.html';
      });
  }

  // Link Exam Handler
  if (linkExamBtn && examCodeInput) {
      linkExamBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          
          const accessCode = examCodeInput.value.trim();
          const token = localStorage.getItem('token');

          if (!accessCode) {
              showFlashMessage('Please enter an exam access code', "error");
              return;
          }

          if (!token) {
              showFlashMessage('Authentication required. Redirecting to login...', "error");
              setTimeout (e => {
                window.location.href = 'login.html'
              }, 1500)
              
              return;
          }

          try {
              const response = await fetch('http://localhost:3000/api/student/start', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ access_code: accessCode })
              });

              const data = await response.json();

              if (!response.ok) {
                  throw new Error(data.message || 'Failed to link exam');
              }

              // Success handling
              showFlashMessage('Exam linked successfully!', "success");
              examCodeInput.value = ''; 
              setTimeout ( r => {
                window.location.reload();
              },2000)

          } catch (error) {
              console.error('Link Exam Error:', error);
              showFlashMessage(error.message || 'An error occurred while linking the exam', "error");
          }
      });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Fetch and display exams
  const loadExams = async () => {
      try {
          const token = localStorage.getItem('token');
          if (!token) {
              showFlashMessage('Please login to view exams', 'error');
              return;
          }

          const response = await fetch('http://localhost:3000/api/student/exams-list', {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });

          if (!response.ok) {
              throw new Error('Failed to fetch exams');
          }

          const exams = await response.json();
          renderExams(exams);

      } catch (error) {
          console.error('Error loading exams:', error);
          showFlashMessage(error.message || 'Error loading exams', 'error');
      }
  };

  const renderExams = (exams) => {
      const testTable = document.querySelector('.test-table');
      testTable.innerHTML = '';
      testTable.innerHTML = `
          <div class="test-row test-header">
              <div>Name</div>
              <div>Percentage</div>
              <div>Score</div>
              <div>Duration</div>
              <div>Action</div>
          </div>
      `;

      exams.forEach(exam => {
          const examRow = document.createElement('div');
          examRow.className = 'test-row';

          examRow.innerHTML = `
              <div>${exam.title}</div>
              <div>${exam.percentage ?? ''}${exam.percentage !== null ? '%' : ''}</div>
              <div>${exam.score ?? ''}</div>
              <div>${formatDuration(exam.duration)}</div>
              <div>
                  ${exam.status === 'completed' ? 
                      `<button class="btn danger results-btn" data-exam-id="${exam.id}">Results</button>` :
                      `<button class="btn danger start-btn" data-exam-id="${exam.exam_id}">Start</button>`
                  }
              </div>
          `;

          testTable.appendChild(examRow);
      });

      // Add event listeners
      document.querySelectorAll('.results-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const examId = e.target.dataset.examId;
              window.location.href = `resultstudent.html?exam_id=${examId}`;
          });
      });

      document.querySelectorAll('.start-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const examId = e.target.dataset.examId;
              startExamFlow(examId);
          });
      });
  };

  const formatDuration = (seconds) => {
      if (!seconds) return '';
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return [hrs, mins, secs].map(v => v.toString().padStart(2, '0')).join(':');
  };

  if (!navigator.geolocation) {
    showFlashMessage('Geolocation is not supported by your browser', 'error');
    return;
  }
  const startExamFlow = async (examId) => {
    try {
      let coords = { latitude: null, longitude: null };
    
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve, 
            reject, 
            {
              enableHighAccuracy: true,
              timeout: 3000,
              maximumAge: 0
            }
          );
        }).catch(error => {
          console.warn('Geolocation error:', error);
          return null;
        });
  
        if (position) {
          coords = position.coords;
        }
      }
  
      if (!coords.latitude || !coords.longitude) {
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        coords = {
          latitude: ipData.latitude,
          longitude: ipData.longitude
        };
      }
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/api/student/${examId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to start exam');
      }
      window.location.href = `page-tests.html?exam_id=${examId}&student_exam_id=${data.student_exam_id}`;
  
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        showFlashMessage('Geolocation is required to start exams', 'error');
      } else if (error.code === error.TIMEOUT) {
        showFlashMessage('Could not get location in time', 'error');
      }else if (error.name === 'GeolocationPositionError') {
          showFlashMessage('Could not verify your location: ' + error.message, 'error');
      } else {
        showFlashMessage(error.message || 'Error starting exam', 'error');
      }
    }
  };
  loadExams();
});
// ----------------------------------------------------------------------------------------------
