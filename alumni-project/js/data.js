/* ============================================================
   DATA STORE — Firebase Firestore
   File: js/data.js
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, doc,
  getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_gIUz7_WIlEvVq3MmFsG51M6kyejthso",
  authDomain: "school-9821f.firebaseapp.com",
  projectId: "school-9821f",
  storageBucket: "school-9821f.firebasestorage.app",
  messagingSenderId: "795641878298",
  appId: "1:795641878298:web:f67603c3b3120915be3ea3"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const COL = {
  alumni:       'alumni',
  stories:      'stories',
  notices:      'notices',
  events:       'events',
  achievements: 'achievements',
  settings:     'settings'
};

window.DATA = {
  alumni: [], stories: [], notices: [], events: [], achievements: []
};

function showLoader(msg = 'Loading...') {
  let el = document.getElementById('fb-loader');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fb-loader';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#1a2744;color:#fff;text-align:center;padding:10px;font-size:14px;font-family:DM Sans,sans-serif;';
    document.body.prepend(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
}
function hideLoader() {
  const el = document.getElementById('fb-loader');
  if (el) el.style.display = 'none';
}

/* ============================================================
   LOAD ALL DATA
   ============================================================ */
window.loadData = async function() {
  showLoader('🔄 Connecting to database...');
  try {
    const [a, s, n, e, ac] = await Promise.all([
      getDocs(query(collection(db, COL.alumni),       orderBy('date', 'desc'))),
      getDocs(query(collection(db, COL.stories),      orderBy('date', 'desc'))),
      getDocs(query(collection(db, COL.notices),      orderBy('date', 'desc'))),
      getDocs(query(collection(db, COL.events),       orderBy('date', 'asc'))),
      getDocs(query(collection(db, COL.achievements), orderBy('date', 'desc')))
    ]);
    window.DATA.alumni       = a.docs.map(d  => ({ id: d.id, ...d.data() }));
    window.DATA.stories      = s.docs.map(d  => ({ id: d.id, ...d.data() }));
    window.DATA.notices      = n.docs.map(d  => ({ id: d.id, ...d.data() }));
    window.DATA.events       = e.docs.map(d  => ({ id: d.id, ...d.data() }));
    window.DATA.achievements = ac.docs.map(d => ({ id: d.id, ...d.data() }));

    if (window.DATA.alumni.length === 0 && window.DATA.notices.length === 0) {
      await seedData();
    }

    hideLoader();
    if (typeof updateStats        === 'function') updateStats();
    if (typeof renderDirectory    === 'function') renderDirectory(getApproved());
    if (typeof renderStories      === 'function') renderStories();
    if (typeof renderNotices      === 'function') renderNotices();
    if (typeof renderEvents       === 'function') renderEvents();
    if (typeof renderAchievements === 'function') renderAchievements();
    if (typeof refreshAdmin === 'function' &&
        document.getElementById('admin-dashboard')?.style.display === 'block') refreshAdmin();

  } catch(err) {
    hideLoader();
    console.error('Firebase error:', err);
    showToast('⚠️ Database error. Check console.');
  }
};

window.saveData = function() { /* no-op — saves happen per-operation */ };

window.getApproved = () => window.DATA.alumni.filter(a => a.status === 'approved');
window.getPending  = () => window.DATA.alumni.filter(a => a.status === 'pending');

/* ---- ALUMNI ---- */
window.fbAddAlumni = async function(entry) {
  const r = await addDoc(collection(db, COL.alumni), { ...entry, date: new Date().toISOString().split('T')[0] });
  entry.id = r.id;
  window.DATA.alumni.unshift(entry);
  if (typeof updateStats === 'function') updateStats();
};

window.fbApproveAlumni = async function(id) {
  await updateDoc(doc(db, COL.alumni, id), { status: 'approved' });
  const f = window.DATA.alumni.find(a => a.id === id);
  if (f) f.status = 'approved';
};

window.fbRejectAlumni = async function(id) {
  await deleteDoc(doc(db, COL.alumni, id));
  window.DATA.alumni = window.DATA.alumni.filter(a => a.id !== id);
};

window.fbDeleteAlumni = async function(id) {
  await deleteDoc(doc(db, COL.alumni, id));
  window.DATA.alumni = window.DATA.alumni.filter(a => a.id !== id);
};

/* ---- STORIES ---- */
window.fbAddStory = async function(story) {
  const r = await addDoc(collection(db, COL.stories), { ...story, date: new Date().toISOString().split('T')[0] });
  story.id = r.id;
  window.DATA.stories.unshift(story);
};

window.fbLikeStory = async function(id, likes) {
  await updateDoc(doc(db, COL.stories, id), { likes });
  const f = window.DATA.stories.find(s => s.id === id);
  if (f) f.likes = likes;
};

window.fbAddComment = async function(id, comments) {
  await updateDoc(doc(db, COL.stories, id), { comments });
  const f = window.DATA.stories.find(s => s.id === id);
  if (f) f.comments = comments;
};

/* ---- NOTICES ---- */
window.fbAddNotice = async function(notice) {
  const r = await addDoc(collection(db, COL.notices), { ...notice, date: new Date().toISOString().split('T')[0] });
  notice.id = r.id;
  window.DATA.notices.unshift(notice);
};

window.fbDeleteNotice = async function(id) {
  await deleteDoc(doc(db, COL.notices, id));
  window.DATA.notices = window.DATA.notices.filter(n => n.id !== id);
};

/* ---- EVENTS ---- */
window.fbAddEvent = async function(ev) {
  const r = await addDoc(collection(db, COL.events), ev);
  ev.id = r.id;
  window.DATA.events.push(ev);
};

window.fbDeleteEvent = async function(id) {
  await deleteDoc(doc(db, COL.events, id));
  window.DATA.events = window.DATA.events.filter(e => e.id !== id);
};

/* ---- ACHIEVEMENTS ---- */
window.fbAddAchievement = async function(item) {
  const r = await addDoc(collection(db, COL.achievements), { ...item, date: new Date().toISOString().split('T')[0] });
  item.id = r.id;
  window.DATA.achievements.push(item);
};

window.fbDeleteAchievement = async function(id) {
  await deleteDoc(doc(db, COL.achievements, id));
  window.DATA.achievements = window.DATA.achievements.filter(a => a.id !== id);
};

/* ---- SCHOOL PHOTO ---- */
window.fbSaveSchoolPhoto = async function(dataUrl) {
  await setDoc(doc(db, COL.settings, 'schoolPhoto'), { url: dataUrl });
};

window.fbLoadSchoolPhoto = async function() {
  try {
    const snap = await getDocs(collection(db, COL.settings));
    snap.forEach(d => {
      if (d.id === 'schoolPhoto') {
        const url = d.data().url;
        const img = document.getElementById('school-photo-img');
        const adminImg = document.getElementById('admin-school-preview');
        if (img && url) img.src = url;
        if (adminImg && url) adminImg.src = url;
      }
    });
  } catch(e) {}
};

/* ---- SEED (first time only) ---- */
async function seedData() {
  showLoader('🌱 Setting up initial data...');
  const alumni = [
    { name:"Rahim Uddin", phone:"+8801711000001", email:"rahim@email.com", location:"Toronto, Canada", batch:"Batch 2005", ssc:2005, teacher:"Mr. Karim", memory:"The annual sports day was unforgettable!", university:"BUET", field:"Civil Engineering", profession:"Civil Engineer", company:"AECOM Canada", facebook:"", linkedin:"", photo:"", status:"approved", date:"2024-01-10" },
    { name:"Nusrat Jahan", phone:"", email:"", location:"Dhaka, Bangladesh", batch:"Batch 2008", ssc:2008, teacher:"Ms. Sultana", memory:"The farewell night was magical.", university:"Dhaka University", field:"English Literature", profession:"Writer & Journalist", company:"Daily Star", facebook:"", linkedin:"", photo:"", status:"approved", date:"2024-02-14" },
    { name:"Tanvir Ahmed", phone:"", email:"", location:"London, UK", batch:"Batch 2010", ssc:2010, teacher:"Mr. Hasan", memory:"Winning the math olympiad as a team.", university:"UCL", field:"Computer Science", profession:"Software Engineer", company:"Google", facebook:"", linkedin:"", photo:"", status:"approved", date:"2024-03-01" }
  ];
  const stories = [
    { authorName:"Tanvir Ahmed", batch:"Batch 2010", title:"The Night Before SSC Exams", body:"I remember the night before our SSC exams. Five of us crammed into Rafi's tiny room, textbooks everywhere. We were terrified, but those were the most alive moments of my life. We all passed — and celebrated at the school canteen like we had conquered the world.", photo:"", anon:false, likes:[], comments:[], date:"2024-05-10" }
  ];
  const notices = [
    { type:"Important", title:"Alumni Registration Now Open", body:"We are thrilled to officially launch the alumni portal! Register now to connect with your batchmates.", date:"2024-07-01" },
    { type:"Announcement", title:"Annual Reunion 2025 — Save the Date", body:"Mark your calendars! The grand alumni reunion is scheduled for December 2025.", date:"2024-08-15" }
  ];
  const events = [
    { title:"Grand Alumni Reunion 2025", date:"2025-12-20", location:"School Auditorium, Pabna", desc:"The biggest alumni gathering of the decade. All batches welcome!" }
  ];
  const achievements = [
    { name:"Tanvir Ahmed", batch:"Batch 2010", title:"Software Engineer at Google", desc:"Tanvir joined Google London after completing his CS degree from UCL.", icon:"🚀", date:"2024-01-01" },
    { name:"Nusrat Jahan", batch:"Batch 2008", title:"Published Author — Bestselling Novel", desc:"Nusrat published her debut novel which became a national bestseller.", icon:"✍️", date:"2024-01-01" }
  ];

  for (const x of alumni)       { const r = await addDoc(collection(db, COL.alumni),       x); window.DATA.alumni.push({id:r.id,...x}); }
  for (const x of stories)      { const r = await addDoc(collection(db, COL.stories),      x); window.DATA.stories.push({id:r.id,...x}); }
  for (const x of notices)      { const r = await addDoc(collection(db, COL.notices),      x); window.DATA.notices.push({id:r.id,...x}); }
  for (const x of events)       { const r = await addDoc(collection(db, COL.events),       x); window.DATA.events.push({id:r.id,...x}); }
  for (const x of achievements)  { const r = await addDoc(collection(db, COL.achievements), x); window.DATA.achievements.push({id:r.id,...x}); }
}
