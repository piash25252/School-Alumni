/* ============================================================
   NOTICES
   File: js/notices.js
   ============================================================ */

function renderNotices() {
  const container = document.getElementById('notices-grid');
  if (!DATA.notices.length) {
    container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:48px;grid-column:1/-1;">No notices yet.</p>';
    return;
  }
  container.innerHTML = DATA.notices.map(n => `
    <div class="notice-card">
      <div class="notice-type">${n.type}</div>
      <div class="notice-title">${n.title}</div>
      <div class="notice-body">${n.body}</div>
      <div class="notice-date">📅 ${n.date}</div>
    </div>
  `).join('');
}


/* ============================================================
   EVENTS
   File: js/events.js
   ============================================================ */

function renderEvents() {
  const container = document.getElementById('events-list');
  if (!DATA.events.length) {
    container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:48px;">No events scheduled yet.</p>';
    return;
  }
  container.innerHTML = DATA.events.map(e => {
    const dateObj = new Date(e.date);
    const month   = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day     = dateObj.getDate();
    return `
      <div class="event-card">
        <div class="event-date-box">
          <div class="event-month">${month}</div>
          <div class="event-day">${day}</div>
        </div>
        <div class="event-info">
          <h3>${e.title}</h3>
          <p>${e.desc}</p>
          <div class="event-loc">📍 ${e.location}</div>
        </div>
      </div>
    `;
  }).join('');
}


/* ============================================================
   ACHIEVEMENTS
   File: js/achievements.js
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
    </div>
  `).join('');
}
