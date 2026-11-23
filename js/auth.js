// login and registration logic
(function(window) {
  'use strict';

  let selectedRole = 'student'; // 'student' or 'admin'

  function init() {
    setupRoleSelector();
    setupPasswordToggles();
    setupLoginForm();
    setupRegisterForm();
    setupDemoButtons();
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
// LOGIN FORM SUBMISSION
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;
      const alertBox = document.getElementById('auth-alert');

      if (!email || !pass) {
        showAlert(alertBox, 'Please enter both your email address and password.', 'error');
        return;
      }

      // Authenticate
      let user = null;
      if (selectedRole === 'admin') {
        user = {
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: 'admin',
          adminId: 'ADMIN-PRESS-01',
          title: 'Senior Newsdesk Administrator'
        };
      } else {
        user = {
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email: email,
          role: 'student',
          studentId: 'NSBM-STU-2026',
          faculty: 'Faculty of Computing'
        };
      }

      if (window.DataStore) {
        window.DataStore.setCurrentUser(user);
      }

      showAlert(alertBox, 'Authentication successful! Redirecting to dashboard...', 'success');

      setTimeout(() => {
        if (selectedRole === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'student-dashboard.html';
        }
      }, 700);
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
        faculty: selectedRole === 'student' ? 'Faculty of Computing' : 'Administrative Bureau'
      };

      if (window.DataStore) {
        window.DataStore.setCurrentUser(user);
      }

      showAlert(alertBox, 'Account created successfully! Launching your portal...', 'success');

      setTimeout(() => {
        if (selectedRole === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'student-dashboard.html';
        }
      }, 800);
    });
  }
// DEMO QUICK LOGIN BUTTONS
function setupDemoButtons() {
    const demoStudentBtn = document.getElementById('demo-student-btn');
    const demoAdminBtn = document.getElementById('demo-admin-btn');

    if (demoStudentBtn) {
      demoStudentBtn.addEventListener('click', () => {
        if (window.DataStore) {
          window.DataStore.loginAsDemo('student');
        }
        window.location.href = 'student-dashboard.html';
      });
    }

    if (demoAdminBtn) {
      demoAdminBtn.addEventListener('click', () => {
        if (window.DataStore) {
          window.DataStore.loginAsDemo('admin');
        }
        window.location.href = 'admin-dashboard.html';
      });
    }
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

