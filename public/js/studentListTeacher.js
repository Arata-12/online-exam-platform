//functions for all pages
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
// ---------------------------------
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
// ---------------------------------
document.getElementById('logout').addEventListener('click', function (e) {
  e.preventDefault();

  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user_type');

  showFlashMessage("Logged out successfully", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});
// --------------------------------------------------------
// fetch students
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:3000/api/teacher/exam-students", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) return;

      const container = document.querySelector(".dashboard-main");

      data.exams.forEach(exam => {
        const studentRows = exam.students.map(s => `
          <tr>
            <td>${s.name}</td>
            <td>
              <span class="badge ${s.status === "completed" ? "completed" : "pending"}">
                <i class="fa-solid ${s.status === "completed" ? "fa-check" : "fa-hourglass-end"}"></i> 
                ${s.status.charAt(0).toUpperCase() + s.status.slice(1)}
              </span>
            </td>
            <td>${s.date}</td>
            <td>${s.status === "completed" ? `<button class="view-btn">View Result</button>` : "—"}</td>
          </tr>`).join('');

        container.innerHTML += `
          <div class="student-list-container">
            <div class="header">
              <h2><i class="fa-solid fa-file-lines"></i> Exam: <span class="exam-title">${exam.title}</span></h2>
              <p>Total Students: <span class="student-count">${exam.students.length}</span></p>
            </div>

            <div class="student-controls">
              <input type="text" placeholder="Search by student name..." class="search-student" />
            </div>

            <table class="student-table">
              <thead>
                <tr><th>Name</th><th>Status</th><th>Assigned Date</th><th>Action</th></tr>
              </thead>
              <tbody>${studentRows}</tbody>
            </table>
          </div>
        `;
      });

      // Redirect logic
      document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          window.location.href = "resultsTeacher.html";
        });
      });
    });
});

  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("search-student")) {
      const input = e.target.value.toLowerCase();
      const rows = e.target.closest(".student-list-container").querySelectorAll("tbody tr");
  
      rows.forEach(row => {
        const studentName = row.querySelector("td").textContent.toLowerCase();
        row.style.display = studentName.includes(input) ? "" : "none";
      });
    }
  });
  