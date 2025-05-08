// Login/Register JS logic
function showFlashMessage(message, type = 'error') {
    const flash = document.getElementById('flash-message');
    flash.innerText = message;
    flash.className = `flash ${type}`;
    flash.classList.remove('hidden');
  
    setTimeout(() => {
      flash.classList.add('hidden');
    }, 4000);
  }
  
  export function handleRegister(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
  
      try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
          showFlashMessage(result.message, 'success');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 2000);
         
        } else {
          showFlashMessage(result.message || 'Registration failed.');
        }
      } catch (err) {
        showFlashMessage('Server error during registration.');
        console.error(err);
      }
    });
  }
  
  export function handleLogin(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
  
      try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (!res.ok) {
          showFlashMessage(result.message || 'Login failed.');
          return;
        }
  
        showFlashMessage(result.message, 'success');
  
        // Store token and user info
        localStorage.setItem('token', result.token);
        localStorage.setItem('user_type', result.user.user_type);
  
        // Redirect based on user type
        if (result.user.user_type === 'teacher') {
          showFlashMessage(result.message, 'success');
          setTimeout(() => {
            window.location.href = 'teacher-dashboard.html';
          }, 2000);
          
        } else if (result.user.user_type === 'student') {
          setTimeout(() => {
            window.location.href = 'student-dashboard.html';
          }, 2000);
          
        } else {
          showFlashMessage('Unknown user type!');
        }
      } catch (err) {
        console.error('Login error:', err);
        showFlashMessage('Server error during login.');
      }
    });
  }
  