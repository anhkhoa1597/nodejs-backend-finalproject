# 📱 SocialApp - Simple Full Stack Social Media Application

A simple full-stack social media web application built with **Node.js**, **Express**, **MongoDB**, and vanilla **HTML/JS**.  
Users can register, login, and perform basic post operations: create, read, update, delete — all protected by **JWT authentication**.

---

## 📁 Project Structure

```
nodejs-backend-finalproject/
├── config/             # App config and MongoDB connection
├── controllers/        # Business logic for users & posts
├── middlewares/        # Authentication & error handling
├── models/             # Mongoose schemas
├── routes/             # Express API routes
├── public/             # Static frontend (HTML + JS)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── post.html
│   └── js/
├── utils/              # Helper functions (logger, token, password)
├── Dockerfile          # Docker support
├── docker-compose.yml  # Docker Compose config
├── app.js              # Express app definition
└── README.md
```

---

## 🔐 Features

- JWT-based login & authentication
- User registration and secure password hashing
- Create, read, update, delete posts (CRUD)
- Post pagination on frontend
- Protected routes (`/index`, `/post`) with token validation
- Frontend built with HTML + native JS + `localStorage` for token
- Custom error classes and centralized error handling
- Modular and maintainable backend (MVC style)
- Docker-ready deployment

---

## 📦 Installation

```bash
git clone <your-repo-url>
cd nodejs-backend-finalproject
npm install
```

---

## ⚙️ Configuration

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialapp
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
FRONTEND_URL=http://localhost:5000
NODE_ENV=development
```

---

## 🚀 Running the App

```bash
npm run dev    # dev mode with nodemon
```

Open in browser: `http://localhost:5000`

---

## 🖥 Frontend Pages

| Page         | Description                            |
|--------------|----------------------------------------|
| `/login`     | Login form                             |
| `/register`  | User registration                      |
| `/index`     | Dashboard, shows posts, needs login    |
| `/post`      | Create/edit/delete post, needs login   |

---

## 📡 API Overview

### `/users`
- `POST /register` – Register new user
- `POST /login` – Authenticate and return token
- `GET /me` – Get info of current user (requires token)
- `PUT /update-password` – Change password
- `DELETE /:id` – Delete user

### `/posts`
- `GET /` – Get all posts by current user
- `POST /post` – Create a new post
- `PUT /:postId` – Update a post
- `DELETE /:postId` – Delete a post

All `/posts` routes require valid JWT token in `Authorization` header.

---

## 🧪 Token Auth Flow

- On login/register → receive token → stored in `localStorage`
- All protected routes checked by middleware `authenticateToken`
- Frontend uses `fetch(..., { headers: { Authorization: 'Bearer <token>' } })`

---

## 📝 Sample `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialapp
JWT_SECRET=secret123
JWT_EXPIRES_IN=1h
```

---

## 🐳 Docker

You can build and run with Docker:

```bash
docker-compose up --build
```

---

## 📚 License

MIT License

---

## 🙌 Author

Built by Khoa Dang Anh — final project for full stack backend practice.
