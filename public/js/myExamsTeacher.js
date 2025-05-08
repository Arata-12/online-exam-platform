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
// fetching data to my exams
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "login.html";
      return;
    }
  
    fetch("http://localhost:3000/api/teacher/exams", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const examList = document.getElementById("exam-list");
        if (!data.exams.length) {
          examList.innerHTML = `<p>No exams found.</p>`;
          return;
        }
  
        examList.innerHTML = data.exams.map(exam => `
          <div class="exam-box">
         <div class="exam-header" onclick="toggleDropdown(this)">
           <div class="exam-info">
             <i class="fas fa-file-alt"></i>
             <span class="exam-title">${exam.title}</span>
           </div>
           <div class="exam-actions">
             <button class="open-btn">Open</button>
             <button class="dropdown-icon"><i class="fas fa-chevron-down"></i></button>
           </div>
         </div>
       
         <div class="exam-dropdown hidden">
           <div class="exam-details">
             <span class="target-audience"><i class="fas fa-users"></i> ${exam.target_audience}</span>
             <span class="status available">${exam.status}</span>
             <button class="results-btn">Results</button>
           </div>
         </div>
       </div>
        `).join('');
        // Redirect logic
        document.querySelectorAll(".results-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            window.location.href = "resultsTeacher.html";
          });
        });
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', function () {
          const searchTerm = this.value.toLowerCase();
          const examBoxes = document.querySelectorAll('.exam-box');
          examBoxes.forEach(box => {
            const title = box.querySelector('.exam-title').textContent.toLowerCase();
            box.style.display = title.includes(searchTerm) ? '' : 'none';
          });
        });
      } else {
        showFlashMessage("Failed to fetch exams.");
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      showFlashMessage("Error fetching exams.");
    });
  });
  
