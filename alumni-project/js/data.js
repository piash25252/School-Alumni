/* ============================================================
   DATA STORE
   File: js/data.js
   - All data lives here
   - Uses localStorage (swap with Firebase later)
   ============================================================ */

let DATA = {
  alumni:       [],   // registered alumni
  stories:      [],   // memory wall posts
  notices:      [],   // notice board
  events:       [],   // reunion & events
  achievements: []    // featured achievements
};

/* ---------- SAVE / LOAD ---------- */

function saveData() {
  try {
    localStorage.setItem('alumni_db', JSON.stringify(DATA));
  } catch(e) {
    console.warn('Could not save data:', e);
  }
}

function loadData() {
  try {
    const stored = localStorage.getItem('alumni_db');
    if (stored) {
      DATA = JSON.parse(stored);
      return;
    }
  } catch(e) {
    console.warn('Could not load data:', e);
  }
  // First time — load sample data
  seedData();
}

/* ---------- SAMPLE / SEED DATA ---------- */

function seedData() {
  DATA.alumni = [
    {
      id: 1,
      name: "Rahim Uddin",
      phone: "+8801711000001",
      email: "rahim@email.com",
      location: "Toronto, Canada",
      batch: "Batch 2005",
      ssc: 2005,
      teacher: "Mr. Karim",
      memory: "The annual sports day was unforgettable!",
      university: "BUET",
      field: "Civil Engineering",
      profession: "Civil Engineer",
      company: "AECOM Canada",
      facebook: "",
      linkedin: "",
      photo: "",
      status: "approved",
      date: "2024-01-10"
    },
    {
      id: 2,
      name: "Nusrat Jahan",
      phone: "+8801712000002",
      email: "nusrat@email.com",
      location: "Dhaka, Bangladesh",
      batch: "Batch 2008",
      ssc: 2008,
      teacher: "Ms. Sultana",
      memory: "The farewell night was magical.",
      university: "Dhaka University",
      field: "English Literature",
      profession: "Writer & Journalist",
      company: "Daily Star",
      facebook: "",
      linkedin: "",
      photo: "",
      status: "approved",
      date: "2024-02-14"
    },
    {
      id: 3,
      name: "Tanvir Ahmed",
      phone: "+8801813000003",
      email: "tanvir@email.com",
      location: "London, UK",
      batch: "Batch 2010",
      ssc: 2010,
      teacher: "Mr. Hasan",
      memory: "Winning the math olympiad as a team.",
      university: "UCL",
      field: "Computer Science",
      profession: "Software Engineer",
      company: "Google",
      facebook: "",
      linkedin: "",
      photo: "",
      status: "approved",
      date: "2024-03-01"
    },
    {
      id: 4,
      name: "Sadia Islam",
      phone: "+8801914000004",
      email: "sadia@email.com",
      location: "New York, USA",
      batch: "Batch 2005",
      ssc: 2005,
      teacher: "Mr. Karim",
      memory: "The school plays and drama club.",
      university: "Columbia University",
      field: "Medicine",
      profession: "Doctor",
      company: "NYU Langone",
      facebook: "",
      linkedin: "",
      photo: "",
      status: "pending",
      date: "2024-06-15"
    }
  ];

  DATA.stories = [
    {
      id: 1,
      authorName: "Tanvir Ahmed",
      batch: "Batch 2010",
      title: "The Night Before SSC Exams",
      body: "I remember the night before our SSC exams. Five of us crammed into Rafi's tiny room, textbooks everywhere, someone's mother bringing tea every hour. We were terrified, but looking back, those were some of the most alive moments of my life. We all passed — and celebrated at the school canteen like we had conquered the world.",
      photo: "",
      anon: false,
      likes: [],
      comments: [{ author: "Nusrat", text: "This made me tear up! 😭" }],
      date: "2024-05-10"
    },
    {
      id: 2,
      authorName: "Anonymous",
      batch: "",
      title: "A Teacher Who Changed Everything",
      body: "There was a teacher whose name I won't mention — but they once stayed after school for two hours to explain algebra to me when everyone else had given up. I was the slowest in class. That patience changed me. I became an engineer. Wherever you are, Sir, thank you.",
      photo: "",
      anon: true,
      likes: [],
      comments: [],
      date: "2024-04-22"
    }
  ];

  DATA.notices = [
    {
      id: 1,
      type: "Important",
      title: "Alumni Registration Now Open",
      body: "We are thrilled to officially launch the alumni portal! Register now to connect with your batchmates and stay updated.",
      date: "2024-07-01"
    },
    {
      id: 2,
      type: "Announcement",
      title: "Annual Reunion 2025 — Save the Date",
      body: "Mark your calendars! The grand alumni reunion is scheduled for December 2025. Details coming soon.",
      date: "2024-08-15"
    },
    {
      id: 3,
      type: "General",
      title: "School Renovation Project",
      body: "Our beloved school is undergoing a major renovation. Alumni donations are welcome to fund the new library.",
      date: "2024-09-01"
    }
  ];

  DATA.events = [
    {
      id: 1,
      title: "Grand Alumni Reunion 2025",
      date: "2025-12-20",
      location: "School Auditorium, Dhaka",
      desc: "The biggest alumni gathering of the decade. All batches welcome. Food, music, and memories!"
    },
    {
      id: 2,
      title: "Batch 2005 – 20 Year Meetup",
      date: "2025-11-05",
      location: "Radisson Blu, Dhaka",
      desc: "Celebrating 20 years since the legendary Batch 2005 walked these halls."
    }
  ];

  DATA.achievements = [
    {
      id: 1,
      name: "Tanvir Ahmed",
      batch: "Batch 2010",
      title: "Software Engineer at Google",
      desc: "Tanvir joined Google London after completing his CS degree from UCL. A proud moment for our alumni community!",
      icon: "🚀"
    },
    {
      id: 2,
      name: "Nusrat Jahan",
      batch: "Batch 2008",
      title: "Published Author — Bestselling Novel",
      desc: "Nusrat published her debut novel which became a national bestseller within weeks of release.",
      icon: "✍️"
    },
    {
      id: 3,
      name: "Sadia Islam",
      batch: "Batch 2005",
      title: "Medical Researcher at NYU",
      desc: "Dr. Sadia is pioneering research on tropical diseases at NYU Langone Health Center.",
      icon: "🏥"
    }
  ];

  saveData();
}

/* ---------- HELPERS ---------- */

function getApproved() {
  return DATA.alumni.filter(a => a.status === 'approved');
}

function getPending() {
  return DATA.alumni.filter(a => a.status === 'pending');
}
