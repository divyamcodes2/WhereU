# 📍 WhereU: Real-Time Location Tracker 🌍

A beautifully animated, real-time location tracker built using **Flask**, **Socket.IO**, **Leaflet.js**, and the **Geolocation API**.  
Track your current location on a stunning, animated map with live updates and mobile-friendly design! 💫

---

## 🔥 Features

✨ **Live Location Tracking**  
🧭 Uses high-accuracy geolocation to fetch your position in real time.

📡 **Real-Time Socket Communication**  
Broadcasts your location using WebSockets to support **multi-user tracking**.

🗺️ **Animated Leaflet Map**  
Custom pulsing marker, glowing path trail, and auto-center view for a beautiful tracking experience.

🎨 **Modern UI Design**

- Sleek **glassmorphism**
- Responsive for mobile 📱 & desktop 💻
- Info cards with dynamic data updates

🚀 **Built for Speed**  
Minimal latency with **Socket.IO** and lightweight client rendering.

🛠️ **Developer Friendly**  
Fully modular code, extensively commented for easy learning & contribution.

---

## 🧠 Technologies Used

| Layer        | Tech Stack                                 |
| ------------ | ------------------------------------------ |
| 🖥️ Frontend  | HTML5, CSS3 (Glassmorphism), Leaflet.js 🗺️ |
| 📡 Real-Time | Socket.IO (v4)                             |
| 🐍 Backend   | Flask + Flask-SocketIO                     |
| 🌍 Location  | Geolocation API (W3C Standard)             |

---

## ⚙️ How It Works

1. The **client** requests your browser’s location continuously.
2. Location data is **broadcast** via Socket.IO to the server.
3. The **server re-broadcasts** it to all connected clients in real time.
4. Each client updates their **animated map** with the live location, drawing a glowing trail as you move!

---

## 🧩 Project Structure

whereu-tracker/
├── app.py # Flask backend with Socket.IO
├── templates/
│ └── index.html # Main HTML with animated UI
├── static/
│ └── script.js # Frontend JS for tracking & animation
├── README.md # You're reading it!
└── requirements.txt # Python dependencies