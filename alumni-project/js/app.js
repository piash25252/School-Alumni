/* ============================================================
   APP INIT
   File: js/app.js
   - Runs on page load
   - Initialises data and home page stats
   ============================================================ */

function updateStats() {
  const approved  = getApproved();
  const batches   = [...new Set(approved.map(a => a.ssc))].length;
  const countries = [...new Set(
    approved.map(a => (a.location || '').split(',').pop().trim())
  )].filter(Boolean).length;

  animateCount('stat-alumni',    approved.length);
  animateCount('stat-batches',   batches);
  animateCount('stat-stories',   DATA.stories.length);
  animateCount('stat-countries', countries);
}

// Boot
loadData();
updateStats();

// Load saved school photo if any
try {
  const savedPhoto = localStorage.getItem('school_photo');
  if (savedPhoto) {
    const img = document.getElementById('school-photo-img');
    const adminImg = document.getElementById('admin-school-preview');
    if (img) img.src = savedPhoto;
    if (adminImg) adminImg.src = savedPhoto;
  }
} catch(e) {}
