/* ============================================================
   UTILITIES
   File: js/utils.js
   - Toast notifications
   - Animated counter
   - Page navigation
   ============================================================ */

/* ---------- TOAST ---------- */

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---------- ANIMATED COUNTER ---------- */

function animateCount(elementId, targetNumber) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.floor(targetNumber / 40));
  const timer = setInterval(() => {
    current = Math.min(current + step, targetNumber);
    el.textContent = current;
    if (current >= targetNumber) clearInterval(timer);
  }, 30);
}

/* ---------- PAGE NAVIGATION ---------- */

function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Remove active from all nav links
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  // Show selected page
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');

  // Highlight nav link
  const navLink = document.getElementById('nav-' + name);
  if (navLink) navLink.classList.add('active');

  window.scrollTo(0, 0);

  // Trigger page-specific renders
  if (name === 'home')          updateStats();
  if (name === 'directory')     renderDirectory(getApproved());
  if (name === 'memories')      renderStories();
  if (name === 'notices')       renderNotices();
  if (name === 'events')        renderEvents();
  if (name === 'achievements')  renderAchievements();
}
