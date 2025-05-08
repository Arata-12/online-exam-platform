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
// ----------------------------------------------
// render questions add
document.getElementById('add-question-btn').onclick = () => {
  document.getElementById('modal-title').innerText = 'Add Question';
  document.getElementById('question-modal').style.display = 'block';
};

document.getElementById('close-modal').onclick = () => {
  document.getElementById('question-modal').style.display = 'none';
};

// Update form dynamically based on question type
document.getElementById('question-type').onchange = (e) => {
  const type = e.target.value;
  const form = document.getElementById('question-form');
  form.innerHTML = '';

  let commonFields = `
    <label for="${type}-media">Media:</label>
    <input type="file" id="${type}-media" accept="image/*,video/*,audio/*" class="file-media"><br>
    <div id="${type}-media-preview" class="media-preview"></div>
  `;

  if (type === 'direct') {
    form.innerHTML = commonFields + `
      <label for="direct-question">Question:</label>
      <input type="text" id="direct-question"><br>

      <label for="direct-answer">Answer:</label>
      <input type="text" id="direct-answer"><br>

      <label for="direct-tolerance">Tolerance:</label>
      <input type="number" id="direct-tolerance"><br>

      <label for="direct-time">Time (sec):</label>
      <input type="number" id="direct-time"><br>

      <label for="direct-points">Points:</label>
      <input type="number" id="direct-points"><br>
    `;

    document.getElementById('direct-media').addEventListener('change', function () {
      previewMedia(this, 'direct-media-preview');
    });

  } else if (type === 'qcm') {
    form.innerHTML = commonFields + `
      <label for="qcm-question">Question:</label>
      <input type="text" id="qcm-question"><br>

      <label>Choices:</label>
      <div id="choices-container">
        <div class="choice-wrapper">
          <input type="radio" name="correct" value="0">
          <input type="text" class="choice" placeholder="Choice A">
        </div>
        <div class="choice-wrapper">
          <input type="radio" name="correct" value="1">
          <input type="text" class="choice" placeholder="Choice B">
        </div>
      </div>
      <button type="button" id="add-choice-btn">+ Add Choice</button><br>

      <label for="qcm-time">Time (sec):</label>
      <input type="number" id="qcm-time"><br>

      <label for="qcm-points">Points:</label>
      <input type="number" id="qcm-points"><br>
    `;

    document.getElementById('qcm-media').addEventListener('change', function () {
      previewMedia(this, 'qcm-media-preview');
    });

    document.getElementById('add-choice-btn').onclick = () => {
      const container = document.getElementById('choices-container');
      const index = container.children.length;
      const choiceDiv = document.createElement('div');
      choiceDiv.className = 'choice-wrapper';
      choiceDiv.innerHTML = `
        <input type="radio" name="correct" value="${index}">
        <input type="text" class="choice" placeholder="Choice ${String.fromCharCode(65 + index)}">
      `;
      container.appendChild(choiceDiv);
    };
  }
};

// Green border on selected correct QCM input
document.addEventListener('change', function (e) {
  if (e.target.name === 'correct') {
    const allChoices = document.querySelectorAll('.choice-wrapper');
    allChoices.forEach((wrapper) => {
      const input = wrapper.querySelector('.choice');
      const radio = wrapper.querySelector('input[type="radio"]');
      if (radio.checked) {
        input.classList.add('selected-correct');
      } else {
        input.classList.remove('selected-correct');
      }
    });
  }
});

// Media preview
function previewMedia(input, previewContainerId) {
  const previewContainer = document.getElementById(previewContainerId);
  previewContainer.innerHTML = '';

  const file = input.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  let mediaElement;

  if (file.type.startsWith('image/')) {
    mediaElement = document.createElement('img');
    mediaElement.src = url;
  } else if (file.type.startsWith('video/')) {
    mediaElement = document.createElement('video');
    mediaElement.src = url;
    mediaElement.controls = true;
  } else if (file.type.startsWith('audio/')) {
    mediaElement = document.createElement('audio');
    mediaElement.src = url;
    mediaElement.controls = true;
  }

  if (mediaElement) {
    mediaElement.classList.add('previewed-media');
    previewContainer.appendChild(mediaElement);
  }
}

// ---------------------------------------------
// fetching manage exam
const examId = new URLSearchParams(window.location.search).get("examId");
const token = localStorage.getItem("token");

// Fetch exam info
fetch(`http://localhost:3000/api/exams/${examId}`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    document.getElementById("exam-title").innerText = data.title;
    document.getElementById("access-link").innerText = data.access_link;
    document.getElementById("exam-description").innerHTML = data.description;

    document.getElementById("edit-title").value = data.title;
    document.getElementById("edit-description").value = data.description;
    document.getElementById("edit-audience").value = data.target_audience;  
  })
  .catch(err => console.error("Exam fetch failed:", err));

// edit & delete
// Delete button
document.getElementById("delete-exam-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this exam?")) {
    fetch(`http://localhost:3000/api/exams/${examId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete");
        showFlashMessage("Exam deleted successfully");
        window.location.href = "CreateExamTeacher.html";
      })
      .catch(err => {
        alert("Error deleting exam: " + err.message)
        showFlashMessage("Error deleting exam: " + err.message, "error");
      });
  }
});
// edit information exam
const editBtn = document.getElementById("edit-exam-btn");
const modal = document.getElementById("edit-modal-manage");
const cancelBtn = document.getElementById("cancel-edit");
const saveBtn = document.getElementById("save-edit");

editBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.style.display = "none";
});

saveBtn.addEventListener("click", () => {
  const updatedExam = {
    title: document.getElementById("edit-title").value,
    description: document.getElementById("edit-description").value,
    target_audience: document.getElementById("edit-audience").value
  };

  fetch(`http://localhost:3000/api/exams/${examId}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updatedExam)
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to update exam");
    return res.json();
  })
  .then(() => {
    showFlashMessage("Exam updated successfully");
    setTimeout ( e =>     location.reload(),1000)
  })
  .catch(err => {
    showFlashMessage("Error: " + err.message);
  });
});

// ------------------------------------------------
// === Fetch Questions and Update Count ===
fetch(`http://localhost:3000/api/questions/${examId}/questions`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => res.json())
.then(questions => {
  const list = document.getElementById("questions-list");
  list.innerHTML = '';

  questions.forEach(q => {
    // Create question card container
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.dataset.questionId = q.id;

    // Create question header
    const header = document.createElement('div');
    header.className = 'question-header';

    const questionNumber = document.createElement('span');
    questionNumber.className = 'question-number';
    questionNumber.textContent = `Question ${q.order_num}`;

    const questionPoints = document.createElement('span');
    questionPoints.className = 'question-points';
    questionPoints.textContent = `${q.points} pts`;

    // Create question content
    const content = document.createElement('div');
    content.className = 'question-content';
    content.textContent = q.content;

    // Create action buttons
    const actions = document.createElement('div');
    actions.className = 'question-actions-container';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn-question';
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn-question';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';

    // Assemble elements
    header.appendChild(questionNumber);
    header.appendChild(questionPoints);
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    questionCard.appendChild(header);
    questionCard.appendChild(content);
    questionCard.appendChild(actions);

    list.appendChild(questionCard);
  });

  // Update summary counts
  document.getElementById("question-count").textContent = `${questions.length} questions`;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  document.getElementById("total-points").textContent = `${totalPoints} pts`;
});
//add question on tap save button 
document.getElementById('save-question-btn').addEventListener('click', async () => {
  const type = document.getElementById('question-type').value;
  const formData = new FormData();
  formData.append('question_type', type);

  if (type === 'direct') {
    const question = document.getElementById('direct-question').value;
    const answer = document.getElementById('direct-answer').value;
    const tolerance = document.getElementById('direct-tolerance').value;
    const time = document.getElementById('direct-time').value;
    const points = document.getElementById('direct-points').value;
    const mediaFile = document.getElementById('direct-media').files[0];

    formData.append('content', question);
    formData.append('answer_content', answer);
    formData.append('tolerance_rate', tolerance);
    formData.append('duration_seconds', time);
    formData.append('points', points);
    if (mediaFile) formData.append('media', mediaFile);

  } else if (type === 'qcm') {
    const question = document.getElementById('qcm-question').value;
    const time = document.getElementById('qcm-time').value;
    const points = document.getElementById('qcm-points').value;
    const mediaFile = document.getElementById('qcm-media').files[0];

    formData.append('content', question);
    formData.append('duration_seconds', time);
    formData.append('points', points);
    if (mediaFile) formData.append('media', mediaFile);

    const options = [];
    const wrappers = document.querySelectorAll('#choices-container .choice-wrapper');
    wrappers.forEach(wrapper => {
      const content = wrapper.querySelector('.choice').value;
      const isCorrect = wrapper.querySelector('input[type="radio"]').checked;
      options.push({content, is_correct: isCorrect });
    });

    formData.append('options', JSON.stringify(options));
  }

  try {
    const res = await fetch(`http://localhost:3000/api/questions/${examId}/questions/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      showFlashMessage('Question added successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showFlashMessage('Error: ' + result.message);
    }
  } catch (err) {
    console.error('Request failed:', err);
    showFlashMessage('Network or server error');
  }
});
// -----------------------------------------------------------------------
// Edit Question Modal Handler
// =========================
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-modal-form');
let currentQuestionId = null;

// Open Modal and Load Data
document.addEventListener('click', async (e) => {
  if (e.target.closest('.edit-btn-question')) {
    try {
      currentQuestionId = e.target.closest('.question-card').dataset.questionId;
      
      // Fetch question data
      const response = await fetch(`http://localhost:3000/api/questions/${currentQuestionId}/questionwithanswers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch question');
      
      const question = await response.json();
      
      // Populate basic fields
      document.getElementById('edit-modal-content').value = question.content;
      document.getElementById('edit-modal-points').value = question.points;
      document.getElementById('edit-modal-duration').value = question.duration_seconds;

      // Handle answer type
      // const isQCM = question.question_type === 'qcm';
      // document.getElementById('edit-modal-direct').classList.toggle('hidden', isQCM);
      // document.getElementById('edit-modal-qcm').classList.toggle('hidden', !isQCM);

      // Populate answers
      // if (isQCM) {
      //   const optionsContainer = document.getElementById('edit-modal-options');
      //   optionsContainer.innerHTML = question.answers.map((answer, index) => `
      //     <div class="option-row" data-answer-id="${answer.id}">
      //       <input type="radio" name="correct-answer" ${answer.is_correct ? 'checked' : ''}>
      //       <input type="text" value="${answer.content}" required>
      //       <button type="button" class="remove-option">&times;</button>
      //     </div>
      //   `).join('');
      // } else {
      //   document.getElementById('edit-modal-answer-content').value = question.answers[0]?.content || '';
      //   document.getElementById('edit-modal-tolerance').value = question.answers[0]?.tolerance_rate || 0;
      // }

      editModal.classList.remove('hidden');
    } catch (error) {
      console.error('Error loading question:', error);
      showFlashMessage('Failed to load question details', 'error');
    }
  }
});

// Close Modal
document.getElementById('edit-modal-close').addEventListener('click', () => {
  editModal.classList.add('hidden');
});


// that's part of editing we gonna add in future
// Add QCM Option
// document.querySelector('.edit-modal-add-option').addEventListener('click', () => {
//   const optionsContainer = document.getElementById('edit-modal-options');
//   const newOption = document.createElement('div');
//   newOption.className = 'option-row';
//   newOption.innerHTML = `
//     <input type="radio" name="correct-answer">
//     <input type="text" placeholder="New option" required>
//     <button type="button" class="remove-option">&times;</button>
//   `;
//   optionsContainer.appendChild(newOption);
// });

// Remove QCM Option
// document.getElementById('edit-modal-options').addEventListener('click', (e) => {
//   if (e.target.classList.contains('remove-option')) {
//     e.target.closest('.option-row').remove();
//   }
// });

// Submit Handler
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    content: document.getElementById('edit-modal-content').value,
    points: document.getElementById('edit-modal-points').value,
    duration_seconds: document.getElementById('edit-modal-duration').value,
    question_type: document.querySelector('.question-card').dataset.questionType,
  };

  // // Handle answers
  // if (formData.question_type === 'direct') {
  //   formData.answer_content = document.getElementById('edit-modal-answer-content').value;
  //   formData.tolerance_rate = document.getElementById('edit-modal-tolerance').value;
  // } else {
  //   formData.options = Array.from(document.querySelectorAll('.option-row')).map(row => ({
  //     content: row.querySelector('input[type="text"]').value,
  //     is_correct: row.querySelector('input[type="radio"]').checked
  //   }));
  // }

  try {
    const response = await fetch(`http://localhost:3000/api/questions/${currentQuestionId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Update failed');
    
    const updatedQuestion = await response.json();
    updateQuestionInUI(updatedQuestion);
    window.location.reload();
    showFlashMessage('Question updated successfully');
    editModal.classList.add('hidden');
  } catch (error) {
    console.error('Update error:', error);
    showFlashMessage('Failed to update question', 'error');
  }
});

// Update UI after edit
function updateQuestionInUI(updatedQuestion) {
  const questionCard = document.querySelector(`[data-question-id="${currentQuestionId}"]`);
  
  // Update basic info
  questionCard.querySelector('.question-content').textContent = updatedQuestion.content;
  questionCard.querySelector('.question-points').textContent = `${updatedQuestion.points} pts`;
  // comming soon we have to complete core in first
  // Update answers if needed
//   if (updatedQuestion.question_type === 'qcm') {
//     const optionsHtml = updatedQuestion.answers.map(a => `
//       <div class="option ${a.is_correct ? 'correct' : ''}">${a.content}</div>
//     `).join('');
//     questionCard.querySelector('.question-options').innerHTML = optionsHtml;
//   }
}
// ======================
// Delete Question Handler
// ======================
document.addEventListener('click', async (e) => {
  if (e.target.closest('.delete-btn-question')) {
    const deleteBtn = e.target.closest('.delete-btn-question');
    currentQuestionId = e.target.closest('.question-card').dataset.questionId;
    const questionCard = deleteBtn.closest('.question-card');

    if (!currentQuestionId) {
      showFlashMessage('Invalid question ID', 'error');
      return;
    }

    if (confirm('Are you sure you want to delete this question?')) {
      try {
        const res = await fetch(`http://localhost:3000/api/questions/${currentQuestionId}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete question');
        }

        // Remove question from UI
        questionCard.remove();
        
        // Update question stats
        updateQuestionStats();
        
        showFlashMessage('Question deleted successfully', 'success');
        
      } catch (err) {
        console.error('Delete error:', err);
        showFlashMessage(err.message || 'Failed to delete question', 'error');
      }
    }
  }
});

// Update question count and points
updateQuestionStats()
// ======================
// Helper Functions
// ======================
function updateQuestionInUI(question) {
  const card = document.querySelector(`[data-question-id="${question.id}"]`);
  if (card) {
    card.querySelector('.question-content').textContent = question.content;
    card.querySelector('.question-points').textContent = `${question.points} pts`;
    
    if (question.question_type === 'qcm') {
      const optionsHtml = question.answers.map(a => `
        <div class="option ${a.is_correct ? 'correct' : ''}">
          ${a.content}
        </div>
      `).join('');
      card.querySelector('.question-options').innerHTML = optionsHtml;
    }
  }
  updateQuestionStats();
}
function updateQuestionStats() {
  const questions = document.querySelectorAll('.question-card');
  document.getElementById('question-count').textContent = `${questions.length} questions`;
  const totalPoints = [...questions].reduce((sum, card) => 
    sum + parseInt(card.querySelector('.question-points').textContent), 0);
  document.getElementById('total-points').textContent = `${totalPoints} pts`;
}

