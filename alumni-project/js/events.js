/* ============================================================
   EVENTS
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
      </div>`;
  }).join('');
}
