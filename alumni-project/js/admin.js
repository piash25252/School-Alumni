/* ============================================================
   ADMIN PANEL
   File: js/admin.js
   - Login
   - Approve / reject alumni
   - Add / delete notices, events, achievements
   - Export CSV
   ============================================================ */

/* ---------- LOGIN ---------- */

function adminLogin() {
  const username = document.getElementById('admin-user').value;
  const password = document.getElementById('admin-pass').value;

  // ⚠️ Change these credentials before going live!
  if (username === 'admin' && password === 'admin123') {
    document.getElementById('admin-login').style.display    = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    refreshAdmin();
    showToast('👋 Welcome, Admin!');
  } else {
    showToast('❌ Invalid credentials');
  }
}

/* ---------- REFRESH DASHBOARD ---------- */

function refreshAdmin() {
  const approved = getApproved();
  const pending  = getPending();

  document.getElementById('adm-total').textContent   = approved.length;
  document.getElementById('adm-pending').textContent  = pending.length;
  document.getElementById('adm-stories').textContent  = DATA.stories.length;
  document.getElementById('adm-events').textContent   = DATA.events.length;

  renderPendingTable();
  renderApprovedTable();
  renderNoticesTable();
  renderEventsTable();
  renderAchieveTable();
}

/* ---------- TAB SWITCHING ---------- */

function adminTab(name, buttonEl) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-panel-section').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (buttonEl) buttonEl.classList.add('active');
}

/* ---------- PENDING ALUMNI ---------- */

function renderPendingTable() {
  const pending = getPending();
  const tbody   = document.getElementById('pending-tbody');

  if (!pending.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px;">No pending registrations</td></tr>';
    return;
  }

  tbody.innerHTML = pending.map(a => `
    <tr>
      <td><strong>${a.name}</strong></td>
      <td>${a.batch}</td>
      <td>${a.ssc}</td>
      <td>${a.profession}</td>
      <td>${a.location}</td>
      <td>
        <button class="btn-approve" onclick="approveAlumni(${a.id})">Approve</button>
        <button class="btn-reject"  onclick="rejectAlumni(${a.id})">Reject</button>
      </td>
    </tr>
  `).join('');
}

function approveAlumni(id) {
  const found = DATA.alumni.find(a => a.id === id);
  if (found) { found.status = 'approved'; saveData(); refreshAdmin(); showToast('✅ Alumni approved!'); }
}

function rejectAlumni(id) {
  DATA.alumni = DATA.alumni.filter(a => a.id !== id);
  saveData(); refreshAdmin(); showToast('❌ Entry rejected.');
}

/* ---------- APPROVED ALUMNI ---------- */

function renderApprovedTable() {
  const approved = getApproved();
  const tbody    = document.getElementById('approved-tbody');
  tbody.innerHTML = approved.map(a => `
    <tr>
      <td><strong>${a.name}</strong></td>
      <td>${a.batch}</td>
      <td>${a.profession}</td>
      <td>${a.location}</td>
      <td><button class="btn-delete" onclick="deleteAlumni(${a.id})">Remove</button></td>
    </tr>
  `).join('');
}

function deleteAlumni(id) {
  if (!confirm('Remove this alumni from the directory?')) return;
  DATA.alumni = DATA.alumni.filter(a => a.id !== id);
  saveData(); refreshAdmin(); showToast('Removed.');
}

/* ---------- NOTICES ---------- */

function renderNoticesTable() {
  const tbody = document.getElementById('notices-tbody');
  tbody.innerHTML = DATA.notices.map(n => `
    <tr>
      <td>${n.type}</td>
      <td>${n.title}</td>
      <td>${n.date}</td>
      <td><button class="btn-delete" onclick="deleteNotice(${n.id})">Delete</button></td>
    </tr>
  `).join('');
}

function addNotice() {
  const type  = document.getElementById('notice-type').value;
  const title = document.getElementById('notice-title').value.trim();
  const body  = document.getElementById('notice-body').value.trim();
  if (!title || !body) { showToast('⚠️ Fill all fields'); return; }

  DATA.notices.unshift({
    id:    Date.now(),
    type, title, body,
    date:  new Date().toISOString().split('T')[0]
  });
  saveData();
  renderNoticesTable();
  renderNotices();
  showToast('📌 Notice added!');
  document.getElementById('notice-title').value = '';
  document.getElementById('notice-body').value  = '';
}

function deleteNotice(id) {
  DATA.notices = DATA.notices.filter(n => n.id !== id);
  saveData(); renderNoticesTable(); showToast('Deleted.');
}

/* ---------- EVENTS ---------- */

function renderEventsTable() {
  const tbody = document.getElementById('events-tbody');
  tbody.innerHTML = DATA.events.map(e => `
    <tr>
      <td>${e.title}</td>
      <td>${e.date}</td>
      <td>${e.location}</td>
      <td><button class="btn-delete" onclick="deleteEvent(${e.id})">Delete</button></td>
    </tr>
  `).join('');
}

function addEvent() {
  const title    = document.getElementById('event-title').value.trim();
  const date     = document.getElementById('event-date').value;
  const location = document.getElementById('event-location').value.trim();
  const desc     = document.getElementById('event-desc').value.trim();
  if (!title || !date || !location) { showToast('⚠️ Fill all fields'); return; }

  DATA.events.push({ id: Date.now(), title, date, location, desc });
  saveData();
  renderEventsTable();
  renderEvents();
  showToast('📅 Event added!');
  document.getElementById('event-title').value    = '';
  document.getElementById('event-date').value     = '';
  document.getElementById('event-location').value = '';
  document.getElementById('event-desc').value     = '';
}

function deleteEvent(id) {
  DATA.events = DATA.events.filter(e => e.id !== id);
  saveData(); renderEventsTable(); showToast('Deleted.');
}

/* ---------- ACHIEVEMENTS ---------- */

function renderAchieveTable() {
  const tbody = document.getElementById('achieve-tbody');
  tbody.innerHTML = DATA.achievements.map(a => `
    <tr>
      <td>${a.name}</td>
      <td>${a.batch}</td>
      <td>${a.title}</td>
      <td><button class="btn-delete" onclick="deleteAchieve(${a.id})">Delete</button></td>
    </tr>
  `).join('');
}

function addAchievement() {
  const name  = document.getElementById('achieve-name').value.trim();
  const batch = document.getElementById('achieve-batch').value.trim();
  const title = document.getElementById('achieve-title').value.trim();
  const desc  = document.getElementById('achieve-desc').value.trim();
  const icon  = document.getElementById('achieve-icon').value.trim() || '🏆';
  if (!name || !title) { showToast('⚠️ Fill all fields'); return; }

  DATA.achievements.push({ id: Date.now(), name, batch, title, desc, icon });
  saveData();
  renderAchieveTable();
  renderAchievements();
  showToast('🏆 Achievement featured!');
  ['achieve-name','achieve-batch','achieve-title','achieve-desc','achieve-icon']
    .forEach(id => document.getElementById(id).value = '');
}

function deleteAchieve(id) {
  DATA.achievements = DATA.achievements.filter(a => a.id !== id);
  saveData(); renderAchieveTable(); showToast('Deleted.');
}

/* ---------- SCHOOL PHOTO CHANGE ---------- */

function changeSchoolPhoto(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    // Update home page photo
    const homeImg = document.getElementById('school-photo-img');
    if (homeImg) homeImg.src = dataUrl;
    // Update admin preview
    const adminPreview = document.getElementById('admin-school-preview');
    if (adminPreview) adminPreview.src = dataUrl;
    // Save to localStorage
    try { localStorage.setItem('school_photo', dataUrl); } catch(e) {}
    // Show success
    document.getElementById('school-photo-success').style.display = 'block';
    setTimeout(() => {
      document.getElementById('school-photo-success').style.display = 'none';
    }, 3000);
    showToast('🖼️ School photo updated!');
  };
  reader.readAsDataURL(input.files[0]);
}

// Make label clickable
document.addEventListener('DOMContentLoaded', () => {
  const label = document.getElementById('school-upload-label');
  if (label) label.onclick = () => document.getElementById('school-photo-upload').click();
});

function exportCSV() {
  const approved = getApproved();
  const headers  = ['Name','Phone','Email','Location','Batch','SSC Year','University','Field','Profession','Company','Date'];
  const rows     = approved.map(a =>
    [a.name,a.phone,a.email,a.location,a.batch,a.ssc,a.university,a.field,a.profession,a.company,a.date]
      .map(v => `"${(v || '').toString().replace(/"/g, '""')}"`)
      .join(',')
  );
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = 'alumni-list.csv';
  link.click();
  showToast('📥 CSV exported!');
}
