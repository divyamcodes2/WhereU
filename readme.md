# 📍 WhereU: Real-Time Location Tracker 🌍

An immersive real-time tracking web app built with ❤️ using **Flask**, **Socket.IO**, **MongoDB**, **Leaflet.js**, and the **Geolocation API**.  
Crafted with modern UI/UX magic 🪄, secure authentication 🔐, and blazing-fast location updates 📡!

---

## ✨ Features That Make It Shine

🚀 **Live Multi-User Location Tracking**

- Real-time GPS tracking via the Geolocation API 🔍
- Instantly broadcasts your position to all users using WebSockets 🌐

🧠 **Secure User System with MongoDB & Sessions**

- Signup/Login with secure password hashing (via Werkzeug) 🔒
- Sessions to remember users across requests 🧾
- Account deletion with one click (and safety checks!) 🗑️

🗺️ **Animated Map Experience (Leaflet.js + CSS)**

- Smooth pulsing location marker 🌟
- Glowing trail effect that follows movement 🌀
- Auto-centering and reactivity as you roam the world 🌎

🎨 **HTML & CSS Wizardry**

- Fully **responsive** layout — from widescreen desktops 🖥️ to compact mobiles 📱
- Beautiful **glassmorphism effects** (blur, transparency, shadows) 💎
- Smooth CSS transitions, animations, modals, and dropdowns 🎭
- Custom-styled buttons, forms, cards, and dropdowns 🧩
- Smart UI logic: Sidebar on PC, stacked top bar on mobile 📐

💬 **Real-Time Communication (Socket.IO)**

- Bi-directional WebSocket power 💬
- Scalable architecture with broadcast-based updates

---

## 🔐 Authentication Flow

- ✅ **Sign Up** with username & password — stored securely in MongoDB 🔐
- 🔑 **Login** with hashed password check
- 🔁 **Session Handling** keeps user logged in across routes
- 🧹 **Logout & Delete** options, with flash alerts for all user feedback ✨

---

## 🧱 Project Structure

whereu-tracker/
├── app.py # Flask backend & routes with real-time Socket.IO handling
├── templates/
│ ├── index.html # Core frontend with Leaflet map & animations
│ ├── login.html # Login form UI
│ └── signup.html # Signup form UI
├── static/
│ ├── script.js # Geolocation & Socket.IO integration (frontend)
│ └── style.css # Glassmorphism styling, animations, responsiveness
├── README.md # ← You are here
└── requirements.txt # Python dependencies

---

## 🧪 How It Works (Behind the Scenes)

1. 🌐 User logs in via Flask forms → session starts
2. 📍 Browser continuously fetches location using `navigator.geolocation.watchPosition()`
3. 📡 Location is **sent via Socket.IO** to the Flask-SocketIO server
4. 🔁 Server **broadcasts location data** to all clients in real time
5. 🗺️ Map updates live, marker pulses, trail draws — **no page refresh needed!**

---

## ⚙️ Technologies Used

| Layer        | Tech Stack                                                      |
| ------------ | --------------------------------------------------------------- |
| 🌐 Frontend  | HTML5, CSS3 (Glassmorphism, Flexbox, Media Queries), Leaflet.js |
| ⚡ Real-Time | Socket.IO (v4)                                                  |
| 🔙 Backend   | Flask + Flask-SocketIO                                          |
| 📂 Database  | MongoDB + PyMongo                                               |
| 🌍 Location  | W3C Geolocation API                                             |
| 🔐 Security  | Werkzeug (Password Hashing)                                     |

---

## 💡 CSS & HTML Power-Ups

- ✨ **Glassmorphism UI** — blur + transparent layering for futuristic vibes
- 🔄 **Smooth dropdown transitions** and button hovers
- 📲 **Responsive layout switch**:
  - **Sidebar** on desktop 💻
  - **Topbar & stacked layout** on mobile 📱
- 🧭 **Adaptive map positioning** using `flex`, `calc()` & media queries
- 🔘 **Custom modal system** for account deletion — with `fadeIn`, `popIn` keyframes!
- 🎯 Focus handling: Button highlights, dropdown interactions, adaptive dropdown placement

---

## ✅ Get Started

1. Clone this repo
2. Install dependencies: pip install -r requirements.txt
3. Run the server: python app.py
4. Open in browser: http://localhost:5000

---

## 🌟 Final Words

**WhereU** isn’t just a tracker — it’s a stylish, secure, and scalable real-time geolocation dashboard designed to impress 🚀  
Whether you're building a live courier app, an event tracker, or just want to learn WebSockets and GPS integration — this is your playground! 🧑‍💻🎮

Built with love, logic, and lots of 💥 emojis!

---
