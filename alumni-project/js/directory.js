/* ============================================================
   ALUMNI DIRECTORY
   File: js/directory.js
   - Render alumni cards
   - Search & filter by name, job, location, batch, university
   ============================================================ */

function renderDirectory(list) {
  const container = document.getElementById('directory-results');
  if (!list.length) {
    container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:48px;grid-column:1/-1;">No alumni found matching your search.</p>';
    return;
  }
  container.innerHTML = list.map(a => `
    <div class="alumni-card">
      <div class="alumni-avatar">
        ${a.photo ? `<img src="${a.photo}" alt="${a.name}">` : (a.name[0] || '?')}
      </div>
      <div class="alumni-name">${a.name}</div>
      <div class="alumni-batch">${a.batch} &middot; SSC ${a.ssc}</div>

      <div class="alumni-info-row">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0
               00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2
               0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        ${a.profession}${a.company ? ' @ ' + a.company : ''}
      </div>

      <div class="alumni-info-row">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0
               1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        ${a.location}
      </div>

      ${a.university ? `
        <div class="alumni-info-row">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z"/>
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0
               0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          </svg>
          ${a.university}${a.field ? ' · ' + a.field : ''}
        </div>` : ''}

      <div class="alumni-tags">
        ${a.facebook ? `<a href="${a.facebook}" target="_blank" class="tag">Facebook</a>` : ''}
        ${a.linkedin ? `<a href="${a.linkedin}" target="_blank" class="tag">LinkedIn</a>` : ''}
      </div>
    </div>
  `).join('');
}

function searchAlumni() {
  let list = getApproved();

  const name       = document.getElementById('s-name').value.trim().toLowerCase();
  const job        = document.getElementById('s-job').value.trim().toLowerCase();
  const location   = document.getElementById('s-location').value.trim().toLowerCase();
  const batchYear  = document.getElementById('s-batch').value.trim();
  const university = document.getElementById('s-university').value.trim().toLowerCase();

  if (name)       list = list.filter(a => a.name.toLowerCase().includes(name));
  if (job)        list = list.filter(a => (a.profession + ' ' + (a.company || '')).toLowerCase().includes(job));
  if (location)   list = list.filter(a => a.location.toLowerCase().includes(location));
  if (batchYear)  list = list.filter(a => a.ssc === parseInt(batchYear));
  if (university) list = list.filter(a => (a.university || '').toLowerCase().includes(university));

  renderDirectory(list);
}

function clearSearch() {
  ['s-name', 's-job', 's-location', 's-batch', 's-university'].forEach(id => {
    document.getElementById(id).value = '';
  });
  renderDirectory(getApproved());
}
