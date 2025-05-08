// flashed messages
function showFlashMessage(message, type = 'success') {
    const flash = document.getElementById('flash-message');
    flash.textContent = message;
    flash.className = `flash ${type}`;
    flash.classList.remove('hidden');
    setTimeout(() => flash.classList.add('hidden'), 3000);
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

// This part handles the profile page for teachers.
// It fetches the teacher's profile data and allows them to update it.
  
  document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showFlashMessage("You must log in first", "error");
      return location.href = "login.html";
    }
  
    // Fetch profile data
    fetch("http://localhost:3000/api/teacher/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const form = document.getElementById('profileForm');
          for (let key in data.profile) {
            if (form[key]) form[key].value = data.profile[key];
          }
        } else {
          showFlashMessage("Failed to load profile", "error");
        }
      });
  
    // Submit profile update
    document.getElementById('profileForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
  
      fetch("http://localhost:3000/api/teacher/profile", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          showFlashMessage(data.message, data.success ? 'success' : 'error');
        });
    });
  });
  