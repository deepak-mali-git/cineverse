# 🎬 CineVerse

**CineVerse** is a modern full-stack movie review and discovery web app that blends the power of **TMDB API** with a custom-built **user authentication and review system**. Users can explore trending films, view trailers, read and post reviews, and interact with a vibrant movie-loving community.

---

## 🚀 Key Features

### 🎥 Movie Discovery & Information
- Browse trending & latest movies
- Search with real-time results
- Detailed movie pages with cast, trailers, and synopsis
- Genre-based filtering and high-res posters
- Ratings, release info, and backdrop visuals

### 👤 User Authentication
- Secure registration & login
- JWT-based session handling
- Username/email login support
- Strong password validation
- Auto-generated avatars
- Persistent login across tabs

### ⭐ Review System
- Write/edit/delete reviews
- Ratings on a 1–10 scale
- Real-time community reviews
- TMDB + CineVerse reviews side-by-side
- Author-wise review grouping

### 📺 Trailer Integration
- Embedded YouTube trailers
- Fetched dynamically via TMDB
- Responsive video player

### 🖌️ Modern UI/UX
- Elegant dark theme (#232946, #eebbc3)
- Mobile-responsive layout
- Smooth transitions & animations
- Intuitive scrollable navbar
- Error messages & loading states

---

## 🧰 Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- React Icons
- CSS3
- Context API

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs
- jsonwebtoken
- CORS

### External APIs
- TMDB API
- YouTube Embed API

---

## 🧬 Database Schema (Simplified)

### 🔐 User Model
- username
- email
- passwordHash
- avatarURL

### 📝 Review Model
- userId
- movieId
- rating (1–10)
- reviewText
- timestamp

---

## 🔐 Authentication Flow

1. Register with username/email & password (validation enforced)
2. Login via email or username
3. JWT is issued and stored securely
4. Sessions persist across tabs
5. Auto logout on token expiry

---

## 🎞️ Movie Data Features

- Real-time fetch from TMDB
- Movie search & genre filtering
- Cast & crew info
- Trailer embedding via YouTube
- External reviews

---

## ✍️ Review Management

- Post reviews with rating/text
- Edit or delete your own reviews
- View community & TMDB reviews
- Live updates without page reloads

---

## 📁 Project Structure

cineverse/
├── client/ # React frontend
│ ├── components/
│ ├── pages/
│ ├── context/
│ └── App.jsx
├── server/ # Node.js backend
│ ├── models/
│ ├── routes/
│ └── index.js
├── .env
└── .gitignore 


---

## 🔑 Environment Variables

Create a `.env` file in both `client/` and `server/` directories.

**Frontend (`client/.env`):**



**Backend (`server/.env`):**



---

## 🛠️ Installation & Setup

1. Clone the repo

git clone https://github.com/deepak-mali-git/cineverse.git
cd cineverse



2. Install dependencies
- Frontend:
  ```
  cd client
  npm install
  ```
- Backend:
  ```
  cd ../server
  npm install
  ```

3. Configure environment variables

4. Start MongoDB (locally or Atlas)

5. Run the backend

  npm run dev
  
6. Run the frontend
  npm run dev



---

## 💎 Unique Highlights

- 🔄 Dual Review System: TMDB + CineVerse reviews
- 🔐 Smart Login: via email or username
- 🧑‍🎨 Auto Avatars: consistent avatar for each user
- ⚡ Live Updates: real-time review updates
- 📱 Fully Responsive: works across all devices
- 🚫 Error-Proof UX: graceful fallback & messaging

---

## 🔮 Future Enhancements

- ✅ Movie Watchlist
- 💡 Personalized Recommendations
- 👥 Social Features (follow/like/reply)
- 🧠 Smart Search Filters
- 📊 Rating Analytics
- ✉️ Email Notifications
- 🌗 Dark/Light Theme Toggle

---

## 👨‍💻 Author

**Deepak Mali**  
🔗 [GitHub](https://github.com/deepak-mali-git)  
💬 Always building. Always learning.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## ⭐ Show some love!

If you like the project, give it a ⭐ on GitHub and consider contributing!  
Feedback, issues, and PRs are always welcome.

