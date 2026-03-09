/* ============================================================
   MEMORY WALL
   File: js/memories.js
   - Post stories
   - Like / comment
   - Anonymous posting
   - Photo upload
   ============================================================ */

let storyPhotoData = '';

function previewStoryPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      storyPhotoData = e.target.result;
      document.getElementById('story-photo-name').textContent = '📎 ' + input.files[0].name;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function postStory() {
  const title = document.getElementById('story-title').value.trim();
  const body  = document.getElementById('story-body').value.trim();
  const anon  = document.getElementById('story-anon').checked;

  if (!title || !body) {
    showToast('⚠️ Please add a title and write your story');
    return;
  }

  const story = {
    id:         Date.now(),
    authorName: anon ? 'Anonymous' : 'A Fellow Alumni',
    batch:      '',
    title,
    body,
    photo:      storyPhotoData,
    anon,
    likes:      [],
    comments:   [],
    date:       new Date().toISOString().split('T')[0]
  };

  DATA.stories.unshift(story);
  saveData();

  // Clear form
  document.getElementById('story-title').value = '';
  document.getElementById('story-body').value  = '';
  document.getElementById('story-photo-name').textContent = '';
  document.getElementById('story-anon').checked = false;
  storyPhotoData = '';

  renderStories();
  showToast('📖 Story posted!');
}

function renderStories() {
  const container = document.getElementById('stories-list');
  if (!DATA.stories.length) {
    container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:48px;">No stories yet. Be the first to share!</p>';
    return;
  }
  container.innerHTML = DATA.stories.map((story, index) => `
    <div class="story-card">
      <div class="story-header">
        <div class="story-avatar">
          ${story.photo && !story.anon
            ? `<img src="${story.photo}" alt="${story.authorName}">`
            : (story.authorName[0] || '?')}
        </div>
        <div>
          <div class="story-author">${story.authorName}</div>
          <div class="story-meta">
            ${story.batch ? story.batch + ' &middot; ' : ''}${story.date}
          </div>
        </div>
      </div>

      <div class="story-title">${story.title}</div>
      <div class="story-body">${story.body}</div>

      ${story.photo
        ? `<img class="story-img" src="${story.photo}" alt="Story photo">`
        : ''}

      <div class="story-actions">
        <button class="story-btn ${story.likes.includes('me') ? 'liked' : ''}"
          onclick="likeStory(${index})">
          ❤️ ${story.likes.length} Like${story.likes.length !== 1 ? 's' : ''}
        </button>
        <button class="story-btn" onclick="toggleComments(${index})">
          💬 ${story.comments.length} Comment${story.comments.length !== 1 ? 's' : ''}
        </button>
      </div>

      <div class="comments-section" id="comments-${index}">
        <div class="comment-input-row">
          <input type="text" placeholder="Write a comment..." id="comment-input-${index}">
          <button class="btn-comment" onclick="addComment(${index})">Post</button>
        </div>
        ${story.comments.map(c =>
          `<div class="comment-item"><strong>${c.author}:</strong> ${c.text}</div>`
        ).join('')}
      </div>
    </div>
  `).join('');
}

function likeStory(index) {
  const story = DATA.stories[index];
  if (story.likes.includes('me')) {
    story.likes = story.likes.filter(l => l !== 'me');
  } else {
    story.likes.push('me');
  }
  saveData();
  renderStories();
}

function toggleComments(index) {
  const el = document.getElementById('comments-' + index);
  el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

function addComment(index) {
  const input = document.getElementById('comment-input-' + index);
  const text  = input.value.trim();
  if (!text) return;
  DATA.stories[index].comments.push({ author: 'You', text });
  saveData();
  renderStories();
  // Re-open comments after re-render
  const el = document.getElementById('comments-' + index);
  if (el) el.style.display = 'block';
}
