/* ============================================================
   MEMORY WALL — Firebase
   ============================================================ */

let storyPhotoData = '';

window.previewStoryPhoto = function(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      storyPhotoData = e.target.result;
      document.getElementById('story-photo-name').textContent = '📎 ' + input.files[0].name;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

window.postStory = async function() {
  const title = document.getElementById('story-title').value.trim();
  const body  = document.getElementById('story-body').value.trim();
  const anon  = document.getElementById('story-anon').checked;

  if (!title || !body) { showToast('⚠️ Please add a title and write your story'); return; }

  const story = {
    authorName: anon ? 'Anonymous' : 'A Fellow Alumni',
    batch: '', title, body,
    photo: storyPhotoData,
    anon, likes: [], comments: []
  };

  try {
    showToast('⏳ Posting...');
    await fbAddStory(story);
    document.getElementById('story-title').value = '';
    document.getElementById('story-body').value  = '';
    document.getElementById('story-photo-name').textContent = '';
    document.getElementById('story-anon').checked = false;
    storyPhotoData = '';
    renderStories();
    showToast('📖 Story posted!');
  } catch(e) {
    showToast('❌ Failed to post. Try again.');
    console.error(e);
  }
}

window.renderStories = function() {
  const container = document.getElementById('stories-list');
  if (!DATA.stories.length) {
    container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:48px;">No stories yet. Be the first to share!</p>';
    return;
  }
  container.innerHTML = DATA.stories.map((story, index) => `
    <div class="story-card">
      <div class="story-header">
        <div class="story-avatar">
          ${story.photo && !story.anon ? `<img src="${story.photo}" alt="${story.authorName}">` : (story.authorName[0] || '?')}
        </div>
        <div>
          <div class="story-author">${story.authorName}</div>
          <div class="story-meta">${story.batch ? story.batch + ' &middot; ' : ''}${story.date}</div>
        </div>
      </div>
      <div class="story-title">${story.title}</div>
      <div class="story-body">${story.body}</div>
      ${story.photo ? `<img class="story-img" src="${story.photo}" alt="Story photo">` : ''}
      <div class="story-actions">
        <button class="story-btn ${story.likes.includes('me') ? 'liked' : ''}" onclick="likeStory('${story.id}', ${index})">
          ❤️ ${story.likes.length} Like${story.likes.length !== 1 ? 's' : ''}
        </button>
        <button class="story-btn" onclick="toggleComments(${index})">
          💬 ${story.comments.length} Comment${story.comments.length !== 1 ? 's' : ''}
        </button>
      </div>
      <div class="comments-section" id="comments-${index}">
        <div class="comment-input-row">
          <input type="text" placeholder="Write a comment..." id="comment-input-${index}">
          <button class="btn-comment" onclick="addComment('${story.id}', ${index})">Post</button>
        </div>
        ${story.comments.map(c => `<div class="comment-item"><strong>${c.author}:</strong> ${c.text}</div>`).join('')}
      </div>
    </div>
  `).join('');
}

window.likeStory = async function(id, index) {
  const story = DATA.stories[index];
  const likes = story.likes.includes('me')
    ? story.likes.filter(l => l !== 'me')
    : [...story.likes, 'me'];
  try {
    await fbLikeStory(id, likes);
    renderStories();
  } catch(e) { console.error(e); }
}

window.toggleComments = function(index) {
  const el = document.getElementById('comments-' + index);
  el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

window.addComment = async function(id, index) {
  const input = document.getElementById('comment-input-' + index);
  const text  = input.value.trim();
  if (!text) return;
  const comments = [...DATA.stories[index].comments, { author: 'You', text }];
  try {
    await fbAddComment(id, comments);
    renderStories();
    const el = document.getElementById('comments-' + index);
    if (el) el.style.display = 'block';
  } catch(e) { console.error(e); }
}
