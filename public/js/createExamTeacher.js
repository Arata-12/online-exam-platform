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
// create exam fetching
document.getElementById("createExamForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) return alert("Please log in first.");

  const formData = new FormData(this);
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    target_audience: formData.get("target_audience"),
  };

  try {
    const response = await fetch("http://localhost:3000/api/exams/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      showFlashMessage("Exam created successfully!", "success");
      const examId = result.exam.id;
      window.location.href = `manage-exam-teacher.html?examId=${examId}`;
    } else {
      showFlashMessage(result.message || "Failed to create exam.");
    }
  } catch (err) {
    console.error("Error creating exam", err);
    showFlashMessage("Server error.");
  }
});

