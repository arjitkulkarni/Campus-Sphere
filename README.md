# 🌐 CampusSphere — Next-Generation Campus Engagement Platform

CampusSphere is a futuristic MERN-based platform designed to connect **students**, **alumni**, and **faculty** through mentorship, opportunities, and campus community engagement. The goal is to build a space where networking becomes a habit — supported by modern UI aesthetics and intelligent features.

---

## 🚀 Tech Stack

### Frontend
- ⚛️ React (Vite)
- 🎨 Vanilla CSS + CSS Variables (Theming)
- 🔗 Axios (API Communication)
- 📌 React Router (Navigation)

### Backend
- 🟢 Node.js + Express.js
- 🍃 MongoDB + Mongoose
- 🔐 JWT Authentication
- 🔄 Socket.io *(planned — real-time messaging and notifications)*

---

## 🏗️ Project Architecture

/CampusSphere
/client → React frontend
/server → Express backend

Monorepo architecture ensures cleaner development, shared components in the future, and optimized deployment.

---

## 🎯 Core Features

| Module | Description |
|--------|-------------|
| 👤 User Profiles | Roles: Student / Alumni / Faculty + Skills + Karma points |
| 📰 Feed System | Post events, achievements, discussions, and opportunities |
| 🤝 Mentorship | Smart-match and session booking |
| 💼 Opportunities | Jobs, Internships, Referrals |
| 🔔 Real-time Engagement | Notifications, messaging *(via Socket.io — planned)* |

---

## 🧱 Database Models (Mongoose)

| Model | Purpose |
|-------|---------|
| `User` | Profile, role, skills, alumni/student tags, reputation |
| `Post` | Feed items with text/media |
| `Opportunity` | Career + internship listings |
| `Connection` | Mentorship / networking relationships |

---

## 🎨 UI/UX Philosophy

> “Futuristic. Human. Emotion-aware.”

- Dark mode by default
- Neon accent colors & glow effects
- Glassmorphism (blurred translucent components)
- Consistent component system using **Atomic Design**
- Mobile-first layouts

---

## 🛠️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/your-username/CampusSphere.git
cd CampusSphere

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Run frontend
cd client
npm run dev

# Run backend
cd ../server
npm start
🧪 Verification Plan
Manual Testing

Register + login with all role types

Create feed posts & view global feed

Discover mentors and book sessions

Validate responsive futuristic design across devices

Automated Testing (Future)

API smoke tests (backend)

Component rendering tests (frontend)

📌 Roadmap

 Authentication + role-based authorization

 User profile & onboarding experience

 Feed module (create / fetch / interact)

 Mentorship matchmaking + booking

 Karma rewards & gamification

 Real-time chat & notifications

 AI skill/interest-based matchmaking (stretch goal)

🤝 Contributing

Contributions are welcome!
You can:

Raise issues 🐛

Suggest enhancements ✨

Submit pull requests 🔧

🧑‍💻 Authors