/* ============================================================
   ACHIEVEMENTS
   ============================================================ */

function renderAchievements() {
  const container = document.getElementById('achievements-grid');
  if (!DATA.achievements.length) {
    container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:48px;grid-column:1/-1;">No achievements featured yet.</p>';
    return;
  }
  container.innerHTML = DATA.achievements.map(a => `
    <div class="achieve-card">
      <div class="achieve-badge">Featured</div>
      <div class="achieve-icon">${a.icon}</div>
      <div class="achieve-name">${a.name}</div>
      <div class="achieve-batch">${a.batch}</div>
      <div style="font-size:16px;font-weight:600;color:var(--navy);margin-bottom:8px;">${a.title}</div>
      <div class="achieve-desc">${a.desc}</div>
    </div>`).join('');
}
