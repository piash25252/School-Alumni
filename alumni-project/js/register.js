/* ============================================================
   REGISTRATION
   File: js/register.js
   ============================================================ */

function previewPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      const preview = document.getElementById('photo-preview');
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('photo-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function submitRegistration() {
  // Get required fields
  const name       = document.getElementById('reg-name').value.trim();
  const batch      = document.getElementById('reg-batch').value.trim();
  const ssc        = document.getElementById('reg-ssc').value.trim();
  const profession = document.getElementById('reg-profession').value.trim();
  const location   = document.getElementById('reg-location').value.trim();

  // Validation
  if (!name || !batch || !ssc || !profession || !location) {
    showToast('⚠️ Please fill in all required fields');
    return;
  }

  // Get photo if uploaded
  const photoEl = document.getElementById('photo-preview');
  const photo = (photoEl.style.display !== 'none') ? photoEl.src : '';

  // Build alumni entry
  const entry = {
    id:         Date.now(),
    name,
    phone:      document.getElementById('reg-phone').value,
    email:      document.getElementById('reg-email').value,
    location,
    batch,
    ssc:        parseInt(ssc),
    teacher:    document.getElementById('reg-teacher').value,
    memory:     document.getElementById('reg-memory').value,
    university: document.getElementById('reg-university').value,
    field:      document.getElementById('reg-field').value,
    profession,
    company:    document.getElementById('reg-company').value,
    facebook:   document.getElementById('reg-facebook').value,
    linkedin:   document.getElementById('reg-linkedin').value,
    photo,
    status:     'pending',
    date:       new Date().toISOString().split('T')[0]
  };

  DATA.alumni.push(entry);
  saveData();

  // Show success message
  document.getElementById('reg-success').style.display = 'block';
  showToast('🎉 Registration submitted! Awaiting admin approval.');
  setTimeout(() => {
    document.getElementById('reg-success').style.display = 'none';
  }, 6000);
}
