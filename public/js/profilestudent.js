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

// flashed messages
function showFlashMessage(message, type = 'success') {
    const flash = document.getElementById('flash-message');
    flash.textContent = message;
    flash.className = `flash ${type}`;
    flash.classList.remove('hidden');
    setTimeout(() => flash.classList.add('hidden'), 3000);
  }
  
  // document.addEventListener('DOMContentLoaded', () => {
  //   const profileForm = document.getElementById('profileForm');
  //   const flashMessage = document.getElementById('flash-message');
  //   const token = localStorage.getItem('token');
  
  //   // Load profile data
  //   fetchProfileData();
  
  //   async function fetchProfileData() {
  //     try {
  //       const response = await fetch('http://localhost:3000/api/student/profile', {
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         }
  //       });
  
  //       const data = await response.json();
  
  //       if (data.success) {
  //         populateForm(data.profile);
  //       } else {
  //         showFlashMessage(data.message, 'error');
  //       }
  //     } catch (error) {
  //       showFlashMessage('Failed to load profile', 'error');
  //     }
  //   }
  
  //   function populateForm(profile) {
  //     document.querySelector('input[name="first_name"]').value = profile.first_name;
  //     document.querySelector('input[name="last_name"]').value = profile.last_name;
  //     document.querySelector('input[name="email"]').value = profile.email;
  //     document.querySelector('input[name="Institution"]').value = profile.Institution;
  //     document.querySelector('input[name="filiere"]').value = profile.filiere;
  //   }
  
  //   profileForm.addEventListener('submit', async (e) => {
  //     e.preventDefault();
  
  //     const formData = {
  //       first_name: profileForm.first_name.value,
  //       last_name: profileForm.last_name.value,
  //       Institution: profileForm.Institution.value,
  //       filiere: profileForm.filiere.value
  //     };
  
  //     try {
  //       const response = await fetch('http://localhost:3000/api/student/profile', {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`
  //         },
  //         body: JSON.stringify(formData)
  //       });
  
  //       const data = await response.json();
  
  //       if (data.success) {
  //         showFlashMessage('Profile updated successfully', 'success');
  //         setTimeout(fetchProfileData, 500); // Refresh data
  //       } else {
  //         showFlashMessage(data.message, 'error');
  //       }
  //     } catch (error) {
  //       showFlashMessage('Failed to update profile', 'error');
  //     }
  //   });
  
  //   function showFlashMessage(message, type = 'success') {
  //     flashMessage.textContent = message;
  //     flashMessage.className = `flash ${type}`;
  //     flashMessage.classList.remove('hidden');
  
  //     setTimeout(() => {
  //       flashMessage.classList.add('hidden');
  //     }, 3000);
  //   }
  // });
