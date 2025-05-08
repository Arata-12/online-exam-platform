// Teacher dashboard JS logic
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
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showFlashMessage("You must be logged in.");
    window.location.href = "login.html";
    return;
  }

  fetch("http://localhost:3000/api/teacher/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("teacher-name").textContent = data.name;
      document.getElementById("total-exams").textContent = data.totalExams;
      document.getElementById("total-students").textContent = data.totalStudents;

      const examsHTML = data.recentExams.map(exam => 
      {
        const date = new Date(exam.date).toLocaleDateString();
      return `
        <tr>
          <td>${exam.title}</td>
          <td>${date}</td>
          <td>${exam.students}</td>
          <td>${exam.status}</td>
          <td><button class="btn-view">View Details</button></td>
        </tr>
      `
      }).join('');
      document.getElementById("recent-exams-table").innerHTML = examsHTML;
      document.querySelectorAll(".btn-view").forEach(btn => {
        btn.addEventListener("click", () => {
          window.location.href = "resultsTeacher.html";
        });
      });

      const activityHTML = data.recentActivity.map(a => {
        const date = new Date(a.date).toLocaleDateString();
        return`
        <tr>
          <td>${a.name}</td>
          <td>${a.exam}</td>
          <td>${a.score}%</td>
          <td>${date}</td>
        </tr>
      `;
      }).join('');
      document.getElementById("recent-activity-table").innerHTML = activityHTML;
    } else {
      showFlashMessage("Error loading dashboard data");
    }
  })
  .catch(err => {
    console.error("Dashboard error:", err);
    showFlashMessage("Error loading dashboard data");
  });
});
