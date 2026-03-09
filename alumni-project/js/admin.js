/* ============================================================
   ADMIN PANEL — Firebase
   ============================================================ */

window.adminLogin = function() {
  const username = document.getElementById('admin-user').value;
  const password = document.getElementById('admin-pass').value;
  if (username === 'admin' && password === 'admin123') {
    document.getElementById('admin-login').style.display     = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    refreshAdmin();
    showToast('👋 Welcome, Admin!');
  } else {
    showToast('❌ Invalid credentials');
  }
}

window.refreshAdmin = function() {
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

window.adminTab = function(name, buttonEl) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-panel-section').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (buttonEl) buttonEl.classList.add('active');
}

/* ---- PENDING ---- */
window.renderPendingTable = function() {
  const pending = getPending();
  const tbody   = document.getElementById('pending-tbody');
  if (!pending.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px;">No pending registrations</td></tr>';
    return;
  }
  tbody.innerHTML = pending.map(a => `
    <tr>
      <td><strong>${a.name}</strong></td>
      <td>${a.batch}</td><td>${a.ssc}</td><td>${a.profession}</td><td>${a.location}</td>
      <td>
        <button class="btn-approve" onclick="approveAlumni('${a.id}')">Approve</button>
        <button class="btn-reject"  onclick="rejectAlumni('${a.id}')">Reject</button>
      </td>
    </tr>`).join('');
}

window.approveAlumni = async function(id) {
  try {
    await fbApproveAlumni(id);
    refreshAdmin();
    showToast('✅ Alumni approved!');
  } catch(e) { showToast('❌ Error. Try again.'); console.error(e); }
}

window.rejectAlumni = async function(id) {
  try {
    await fbRejectAlumni(id);
    refreshAdmin();
    showToast('❌ Entry rejected.');
  } catch(e) { showToast('❌ Error.'); console.error(e); }
}

/* ---- APPROVED ---- */
window.renderApprovedTable = function() {
  const approved = getApproved();
  const tbody    = document.getElementById('approved-tbody');
  tbody.innerHTML = approved.map(a => `
    <tr>
      <td><strong>${a.name}</strong></td><td>${a.batch}</td><td>${a.profession}</td><td>${a.location}</td>
      <td><button class="btn-delete" onclick="deleteAlumni('${a.id}')">Remove</button></td>
    </tr>`).join('');
}

window.deleteAlumni = async function(id) {
  if (!confirm('Remove this alumni from the directory?')) return;
  try {
    await fbDeleteAlumni(id);
    refreshAdmin();
    renderDirectory(getApproved());
    showToast('Removed.');
  } catch(e) { showToast('❌ Error.'); console.error(e); }
}

/* ---- NOTICES ---- */
window.renderNoticesTable = function() {
  const tbody = document.getElementById('notices-tbody');
  tbody.innerHTML = DATA.notices.map(n => `
    <tr>
      <td>${n.type}</td><td>${n.title}</td><td>${n.date}</td>
      <td><button class="btn-delete" onclick="deleteNotice('${n.id}')">Delete</button></td>
    </tr>`).join('');
}

window.addNotice = async function() {
  const type  = document.getElementById('notice-type').value;
  const title = document.getElementById('notice-title').value.trim();
  const body  = document.getElementById('notice-body').value.trim();
  if (!title || !body) { showToast('⚠️ Fill all fields'); return; }
  try {
    const notice = { type, title, body };
    await fbAddNotice(notice);
    renderNoticesTable();
    renderNotices();
    showToast('📌 Notice added!');
    document.getElementById('notice-title').value = '';
    document.getElementById('notice-body').value  = '';
  } catch(e) { showToast('❌ Error.'); console.error(e); }
}

window.deleteNotice = async function(id) {
  try {
    await fbDeleteNotice(id);
    renderNoticesTable();
    renderNotices();
    showToast('Deleted.');
  } catch(e) { showToast('❌ Error.'); console.error(e); }
}

/* ---- EVENTS ---- */
window.renderEventsTable = function() {
  const tbody = document.getElementById('events-tbody');
  tbody.innerHTML = DATA.events.map(e => `
    <tr>
      <td>${e.title}</td><td>${e.date}</td><td>${e.location}</td>
      <td><button class="btn-delete" onclick="deleteEvent('${e.id}')">Delete</button></td>
    </tr>`).join('');
}

window.addEvent = async function() {
  const title    = document.getElementById('event-title').value.trim();
  const date     = document.getElementById('event-date').value;
  const location = document.getElementById('event-location').value.trim();
  const desc     = document.getElementById('event-desc').value.trim();
  if (!title || !date || !location) { showToast('⚠️ Fill all fields'); return; }
  try {
    const ev = { title, date, location, desc };
    await fbAddEvent(ev);
    renderEventsTable();
    renderEvents();
    showToast('📅 Event added!');
    ['event-title','event-date','event-location','event-desc'].forEach(id => document.getElementById(id).value = '');
  } catch(e) { showToast('❌ Error.'); console.error(e); }
}

window.deleteEvent = async function(id) {
  try {
    await fbDeleteEvent(id);
    renderEventsTable();
    renderEvents();
    showToast('Deleted.');
  } catch(e) { showToast('❌ Error.'); console.error(e); }
}

/* ---- ACHIEVEMENTS ---- */
window.renderAchieveTable = function() {
  const tbody = document.getElementById('achieve-tbody');
  tbody.innerHTML = DATA.achievements.map(a => `
    <tr>
      <td>${a.name}</td><td>${a.batch}</td><td>${a.title}</td>
      <td><button class="btn-delete" onclick="deleteAchieve('${a.id}')">Delete</button></td>
    </tr>`).join('');
}

window.addAchievement = async function() {
  const name  = document.getElementById('achieve-name').value.trim();
  const batch = document.getElementById('achieve-batch').value.trim();
  const title = document.getElementById('achieve-title').value.trim();
  const desc  = document.getElementById('achieve-desc').value.trim();
  const icon  = document.getElementById('achieve-icon').value.trim() || '🏆';
  if (!name || !title) { showToast('⚠️ Fill all fields'); return; }
  try {
    const item = { name, batch, title, desc, icon };
    await fbAddAchievement(item);
    renderAchieveTable();
    renderAchievements();
    showToast('🏆 Achievement featured!');
    ['achieve-name','achieve-batch','achieve-title','achieve-desc','achieve-icon'].forEach(id => document.getElementById(id).value = '');
  } catch(e) { showToast('❌ Error.'); console.error(e); }
}

window.deleteAchieve = async function(id) {
  try {
    await fbDeleteAchievement(id);
    renderAchieveTable();
    renderAchievements();
    showToast('Deleted.');
  } catch(e) { showToast('❌ Error.'); console.error(e); }
}

/* ---- SCHOOL PHOTO ---- */
window.changeSchoolPhoto = function(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = async e => {
    const dataUrl = e.target.result;
    const homeImg  = document.getElementById('school-photo-img');
    const adminImg = document.getElementById('admin-school-preview');
    if (homeImg)  homeImg.src  = dataUrl;
    if (adminImg) adminImg.src = dataUrl;
    try {
      await fbSaveSchoolPhoto(dataUrl);
      document.getElementById('school-photo-success').style.display = 'block';
      setTimeout(() => { document.getElementById('school-photo-success').style.display = 'none'; }, 3000);
      showToast('🖼️ School photo updated!');
    } catch(e) { showToast('❌ Photo save failed.'); console.error(e); }
  };
  reader.readAsDataURL(input.files[0]);
}

document.addEventListener('DOMContentLoaded', () => {
  const label = document.getElementById('school-upload-label');
  if (label) label.onclick = () => document.getElementById('school-photo-upload').click();
});

/* ---- CSV EXPORT ---- */
window.exportCSV = function() {
  const approved = getApproved();
  const headers  = ['Name','Phone','Email','Location','Batch','SSC Year','University','Field','Profession','Company','Date'];
  const rows     = approved.map(a =>
    [a.name,a.phone,a.email,a.location,a.batch,a.ssc,a.university,a.field,a.profession,a.company,a.date]
      .map(v => `"${(v||'').toString().replace(/"/g,'""')}"`)
      .join(',')
  );
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'alumni-list.csv'; link.click();
  showToast('📥 CSV exported!');
}
