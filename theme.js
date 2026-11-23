// dark and light theme toggle
(function(window) {
  'use strict';

  const THEME_KEY = 'nsbm_newsdesk_theme';

  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateToggleButtons(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  function updateToggleButtons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle-btn');
    buttons.forEach(btn => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      btn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      
      const iconContainer = btn.querySelector('.theme-toggle-icon');
      if (iconContainer) {
        if (window.AppIcons) {
          iconContainer.innerHTML = isDark ? window.AppIcons.get('sun') : window.AppIcons.get('moon');
        } else {
          iconContainer.innerHTML = isDark ? 'â˜€' : 'â˜¾';
        }
      }

      const textContainer = btn.querySelector('.theme-toggle-text');
      if (textContainer) {
        textContainer.textContent = isDark ? 'Light' : 'Dark';
      }
    });
  }

  // Early theme initialization before render to avoid flash
  const initialTheme = getSavedTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // Bind to DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    updateToggleButtons(getSavedTheme());

    // Delegate click for theme toggle buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle-btn');
      if (btn) {
        e.preventDefault();
        toggleTheme();
      }
    });
  });

  window.ThemeEngine = {
    getTheme: getSavedTheme,
    setTheme: applyTheme,
    toggle: toggleTheme
  };

})(window);

