/* ============================================================
   REGISTRATION — Firebase
   ============================================================ */

window.previewPhoto = function(input) {
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

window.submitRegistration = async function() {
  const name       = document.getElementById('reg-name').value.trim();
  const batch      = document.getElementById('reg-batch').value.trim();
  const ssc        = document.getElementById('reg-ssc').value.trim();
  const profession = document.getElementById('reg-profession').value.trim();
  const location   = document.getElementById('reg-location').value.trim();

  if (!name || !batch || !ssc || !profession || !location) {
    showToast('⚠️ Please fill in all required fields');
    return;
  }

  const photoEl = document.getElementById('photo-preview');
  const photo   = (photoEl.style.display !== 'none') ? photoEl.src : '';

  const entry = {
    name, location, batch, profession, photo,
    phone:      document.getElementById('reg-phone').value,
    email:      document.getElementById('reg-email').value,
    ssc:        parseInt(ssc),
    teacher:    document.getElementById('reg-teacher').value,
    memory:     document.getElementById('reg-memory').value,
    university: document.getElementById('reg-university').value,
    field:      document.getElementById('reg-field').value,
    company:    document.getElementById('reg-company').value,
    facebook:   document.getElementById('reg-facebook').value,
    linkedin:   document.getElementById('reg-linkedin').value,
    status:     'pending'
  };

  try {
    showToast('⏳ Submitting...');
    await fbAddAlumni(entry);
    document.getElementById('reg-success').style.display = 'block';
    showToast('🎉 Registration submitted! Awaiting admin approval.');
    setTimeout(() => {
      document.getElementById('reg-success').style.display = 'none';
    }, 6000);
    // Clear form
    document.querySelectorAll('#page-register input, #page-register textarea').forEach(el => el.value = '');
    document.getElementById('photo-preview').style.display = 'none';
    document.getElementById('photo-placeholder').style.display = 'block';
  } catch(e) {
    showToast('❌ Submission failed. Try again.');
    console.error(e);
  }
}
