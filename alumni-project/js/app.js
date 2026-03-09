/* ============================================================
   APP INIT — Firebase
   ============================================================ */

window.updateStats = function() {
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

// Boot — loadData() is defined in data.js (ES module), called after module loads
document.addEventListener('DOMContentLoaded', () => {
  if (typeof loadData === 'function') {
    loadData().then(() => {
      if (typeof fbLoadSchoolPhoto === 'function') fbLoadSchoolPhoto();
    });
  }
});
