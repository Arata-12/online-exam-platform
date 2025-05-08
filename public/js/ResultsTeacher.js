function toggleDropdown(el) {
    const dropdown = el.nextElementSibling;
    dropdown.classList.toggle('hidden');
    const icon = el.querySelector('.dropdown-icon i');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
  }
  document.getElementById('userDropdownToggle').addEventListener('click', () => {
    document.getElementById('userDropdown').classList.toggle('show');
  });
  
  // Hide dropdown on outside click
  window.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    const toggle = document.getElementById('userDropdownToggle');
  
    if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
// Highlight the active link in the sidebar
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll('.sidebar-menu a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
document.getElementById('notification').addEventListener('click', function() {
    const flashMsg = document.createElement('div');
    flashMsg.textContent = 'This feature is coming soon...';
    flashMsg.style.position = 'fixed';
    flashMsg.style.top = '20px';
    flashMsg.style.right = '130px';
    flashMsg.style.padding = '12px 20px';
    flashMsg.style.background = '#f8d7da';
    flashMsg.style.color = '#721c24';
    flashMsg.style.borderRadius = '5px';
    flashMsg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    flashMsg.style.zIndex = '1000';
    flashMsg.style.animation = 'fadeIn 0.3s ease-out';
  
    document.body.appendChild(flashMsg);
  
    setTimeout(() => {
        flashMsg.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => flashMsg.remove(), 300);
    }, 1000);
  });
// flashed messages
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
// -------------------------------------------------
// START results teacher page logic
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/teacher/results', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          console.error(data.message);
          return;
        }
  
        const container = document.querySelector('.dashboard-main');
  
        data.data.forEach(exam => {
          const examBox = document.createElement('div');
          examBox.classList.add('results-section');
  
          examBox.innerHTML = `
            <div class="result-summary">
              <h2><i class="fa-solid fa-file-lines"></i> ${exam.exam_title}</h2>
              <p><strong>Total Students:</strong> ${exam.total_students}</p>
              <p><strong>Average Score:</strong> ${exam.average_score}</p>
            </div>
  
            <table class="result-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                ${exam.students.map(s => `
                  <tr>
                    <td>${s.full_name}</td>
                    <td>
                      <span class="badge ${s.status === 'completed' ? 'completed' : 'pending'}">
                        ${s.status === 'completed' ? '<i class="fa-solid fa-check"></i> Completed' : '<i class="fa-solid fa-hourglass-end"></i> In Progress'}
                      </span>
                    </td>
                    <td>${s.total_score !== null ? s.total_score : '-'}</td>
                    <td>${s.submission_time ? new Date(s.submission_time).toLocaleDateString() : '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
  
          container.appendChild(examBox);
        });
      })
      .catch(err => {console.error("Failed to load results:", err);
        showFlashMessage("Failed to load results. Please try again.", "error");
      });
  });
  