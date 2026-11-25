// login and registration logic
(function(window) {
  'use strict';

  let selectedRole = 'student'; // 'student' or 'admin'

  function init() {
    setupRoleSelector();
    setupPasswordToggles();
    setupLoginForm();
    setupRegisterForm();
  }
// ROLE SELECTOR TABS
function setupRoleSelector() {
    const roleBtns = document.querySelectorAll('.role-tab-btn');
    roleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedRole = btn.getAttribute('data-role');

        // Update placeholder or ID label if present
        const idLabel = document.getElementById('id-field-label');
        const idInput = document.getElementById('reg-id-input');
        if (idLabel && idInput) {
          if (selectedRole === 'admin') {
            idLabel.textContent = 'Staff / Faculty ID';
            idInput.placeholder = 'e.g., NSBM-ADMIN-04';
          } else {
            idLabel.textContent = 'Student ID Number';
            idInput.placeholder = 'e.g., NSBM-IT-24-9021';
          }
        }
      });
    });
  }
// PASSWORD VISIBILITY TOGGLE
function setupPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.password-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.title = isPassword ? 'Hide password' : 'Show password';

        if (window.AppIcons) {
          btn.innerHTML = `<span class="pw-eye-slot">${isPassword ? window.AppIcons.get('eyeOff', 'svg-icon-sm') : window.AppIcons.get('eye', 'svg-icon-sm')}</span>`;
        } else {
          btn.textContent = isPassword ? 'Hide' : 'Show';
        }
      });
    });
  }
// LOGIN FORM SUBMISSION (STRICT CREDENTIAL VALIDATION)
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const alertBox = document.getElementById('auth-alert');
    const errorFeedback = document.getElementById('login-error-feedback');
    const errorText = document.getElementById('login-error-text');

    function showLoginError(msg) {
      if (emailInput) {
        emailInput.classList.add('input-error');
        emailInput.style.border = '1px solid #ff4d4d';
      }
      if (passInput) {
        passInput.classList.add('input-error');
        passInput.style.border = '1px solid #ff4d4d';
        passInput.value = '';
        passInput.focus();
      }
      const message = msg || 'Incorrect username or password. Please try again.';
      if (errorFeedback && errorText) {
        errorText.textContent = message;
        errorFeedback.style.display = 'flex';
      }
      if (alertBox) {
        showAlert(alertBox, message, 'error');
      }
    }

    function clearErrors() {
      if (emailInput) {
        emailInput.classList.remove('input-error');
        emailInput.style.border = '';
      }
      if (passInput) {
        passInput.classList.remove('input-error');
        passInput.style.border = '';
      }
      if (errorFeedback) errorFeedback.style.display = 'none';
      if (alertBox) alertBox.style.display = 'none';
    }

    if (emailInput) emailInput.addEventListener('input', clearErrors);
    if (passInput) passInput.addEventListener('input', clearErrors);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const identifier = emailInput ? emailInput.value.trim() : '';
      const pass = passInput ? passInput.value : '';

      if (!identifier || !pass) {
        showLoginError('Incorrect username or password. Please try again.');
        return;
      }

      let user = null;
      const cleanId = identifier.toLowerCase();

      // Check Administrator Account (Username: admin, Password: NsbmAdmin@2026!)
      if ((cleanId === 'admin' || cleanId === 'admin@nsbm.ac.lk') && pass === 'NsbmAdmin@2026!') {
        user = {
          id: 1,
          username: 'admin',
          name: 'NSBM Editorial Administrator',
          email: 'admin@nsbm.ac.lk',
          role: 'admin',
          adminId: 'NSBM-ADM-001',
          title: 'Chief Newsdesk Administrator',
          faculty: 'University Media Bureau'
        };
      } else if (cleanId === 'student' || cleanId === 'student@students.nsbm.ac.lk') {
        if (pass === 'NsbmAdmin@2026!' || pass === 'NsbmStudent@2026!' || pass === 'nsbm2026') {
          user = {
            id: 2,
            username: 'student',
            name: 'NSBM Student Contributor',
            email: 'student@students.nsbm.ac.lk',
            role: 'student',
            studentId: 'NSBM-IT-24-9021',
            faculty: 'Faculty of Computing',
            title: 'Student Reporter'
          };
        } else {
          showLoginError('Incorrect username or password. Please try again.');
          return;
        }
      } else {
        // Check dynamically registered user accounts
        let registeredUsers = [];
        try {
          registeredUsers = JSON.parse(localStorage.getItem('nsbm_newsdesk_registered_users') || '[]');
        } catch(err) {}
        const found = registeredUsers.find(u => 
          (u.email && u.email.toLowerCase() === cleanId || 
           (u.studentId && u.studentId.toLowerCase() === cleanId) || 
           (u.username && u.username.toLowerCase() === cleanId)) && 
          u.password === pass
        );
        if (found) {
          user = found;
        } else {
          showLoginError('Incorrect username or password. Please try again.');
          return;
        }
      }

      // Save user session into BOTH localStorage and sessionStorage
      const userJson = JSON.stringify(user);
      try {
        localStorage.setItem('nsbm_newsdesk_current_user_v7', userJson);
        sessionStorage.setItem('nsbm_newsdesk_session_user', userJson);
      } catch(e) {}

      if (window.DataStore) {
        window.DataStore.setCurrentUser(user);
      }

      if (errorFeedback) errorFeedback.style.display = 'none';

      // IMMEDIATELY execute window.location.href
      const targetUrl = user.role === 'admin' ? 'admin-dashboard.html' : 'index.html';
      window.location.href = targetUrl;
    });
  }

// REGISTRATION FORM SUBMISSION
function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const idNumber = document.getElementById('reg-id-input').value.trim();
      const pass = document.getElementById('reg-password').value;
      const passConfirm = document.getElementById('reg-password-confirm').value;
      const alertBox = document.getElementById('auth-alert');

      if (!name || !email || !idNumber || !pass) {
        showAlert(alertBox, 'All fields are required for campus press registration.', 'error');
        return;
      }

      if (pass.length < 6) {
        showAlert(alertBox, 'Password must be at least 6 characters long.', 'error');
        return;
      }

      if (pass !== passConfirm) {
        showAlert(alertBox, 'Passwords do not match. Please verify.', 'error');
        return;
      }

      const user = {
        name: name,
        email: email,
        role: selectedRole,
        studentId: idNumber,
        faculty: selectedRole === 'student' ? 'Faculty of Computing' : 'Administrative Bureau',
        password: pass
      };

      try {
        const storedUsers = JSON.parse(localStorage.getItem('nsbm_newsdesk_registered_users') || '[]');
        storedUsers.push(user);
        localStorage.setItem('nsbm_newsdesk_registered_users', JSON.stringify(storedUsers));
      } catch(e) {}

      if (window.DataStore) {
        window.DataStore.setCurrentUser(user);
      }
      // Explicit fallback: persist in localStorage + sessionStorage
      try {
        const userJson = JSON.stringify(user);
        localStorage.setItem('nsbm_newsdesk_current_user_v7', userJson);
        sessionStorage.setItem('nsbm_newsdesk_session_user', userJson);
      } catch(e) {}

      showAlert(alertBox, 'Account created successfully! Launching your portal...', 'success');

      setTimeout(() => {
        if (selectedRole === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'campus-feed.html';
        }
      }, 800);
    });
  }

  function showAlert(alertEl, msg, type) {
    if (!alertEl) return;
    alertEl.textContent = msg;
    alertEl.className = 'auth-alert ' + (type === 'error' ? 'auth-alert-error' : 'auth-alert-success');
    alertEl.style.display = 'flex';
  }

  // Auto initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);

