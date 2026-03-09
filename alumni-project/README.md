# Alumni Network Website

## 📁 File Structure

```
alumni-project/
│
├── index.html          ← Main HTML (সব pages এখানে)
│
├── css/
│   └── style.css       ← সব CSS / design এখানে
│
└── js/
    ├── data.js         ← সব data & localStorage
    ├── utils.js        ← Toast, counter, page navigation
    ├── register.js     ← Registration form
    ├── directory.js    ← Alumni directory & search
    ├── memories.js     ← Memory Wall / stories
    ├── notices.js      ← Notice board + Events + Achievements
    ├── admin.js        ← Admin panel (approve, add, export)
    └── app.js          ← App boot / init
```

---

## 🚀 Netlify তে Upload করবে কীভাবে

1. এই পুরো `alumni-project` folder টা zip করো
2. [netlify.com/drop](https://netlify.com/drop) এ যাও
3. Zip file টা drag & drop করো
4. Done! তোমার link পাবে

---

## 🔐 Admin Panel

- **URL:** website খুলে nav থেকে "Admin" click করো
- **Username:** `admin`
- **Password:** `admin123`
- ⚠️ Production এ যাওয়ার আগে `js/admin.js` এ password change করো

---

## ✏️ School Name Change করবে কীভাবে

`index.html` এ এই দুটো জায়গা search করো:
```
[Your School Name]
```
এবং তোমার school এর নাম দিয়ে replace করো।

---

## 🔧 কোন File কী কাজ করে

| File | কাজ |
|------|-----|
| `index.html` | সব pages এর HTML structure |
| `css/style.css` | Design, colors, fonts, layout |
| `js/data.js` | Data save/load, sample data |
| `js/utils.js` | Toast message, page switching |
| `js/register.js` | Registration form submit |
| `js/directory.js` | Alumni search & filter |
| `js/memories.js` | Story post, like, comment |
| `js/notices.js` | Notice, Event, Achievement render |
| `js/admin.js` | Admin panel সব কিছু |
| `js/app.js` | Website শুরু হওয়ার সময় চলে |

---

## 🔥 Firebase Connect করতে চাইলে

`js/data.js` এর `saveData()` ও `loadData()` function দুটো Firebase SDK দিয়ে replace করলেই হবে।
পরে চাইলে help নিতে পারো।
