# 🛠️ Node.js + Express Backend Template

A modular and secure RESTful API backend built with **Node.js**, **Express**, and **MongoDB**, following **MVC architecture** with clear separation of concerns and production-ready configurations.

---

## 📁 Project Structure

```
backend-template/
├── config/             # DB connection & global config
│   ├── config.js
│   └── db.js
├── controllers/        # Business logic
│   └── userController.js
├── logs/               # Winston log files
│   ├── combined.log
│   ├── debug.log
│   └── error.log
├── middlewares/        # Custom middleware (e.g. auth, error handler)
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models/             # Mongoose schemas
│   └── user.js
├── routes/             # API route definitions
│   └── user.routes.js
├── utils/              # Utility helpers
│   ├── logger.js
│   ├── passwordUtils.js
│   └── tokenUtils.js
├── .env
├── .gitignore
├── app.js              # Express app setup
├── server.js           # Entry point and app bootstrap
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Features

- ✅ MVC folder structure
- ✅ MongoDB with Mongoose
- ✅ JWT authentication & token verification
- ✅ Secure headers with Helmet
- ✅ CORS support
- ✅ Logging with Winston & Morgan
- ✅ Custom error handling with centralized middleware
- ✅ Auto reload with Nodemon in development
- ✅ Modular utils for password & token handling

---

## 🧩 Requirements

- Node.js >= 14
- MongoDB (local or Atlas)
- npm or yarn

---

## 📦 Installation

```bash
git clone https://github.com/anhkhoa1597/nodejs-backend-template.git
cd nodejs-backend-template
npm install
```

---

## ⚙️ Configuration

Create a `.env` file in the root with the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/myapp
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
```

---

## 🧪 Running the Server

```bash
npm run dev   # uses nodemon
```

or

```bash
node server.js
```

Server runs at: `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL: `/users`

| Method | Endpoint           | Description                     | Auth Required |
| ------ | ------------------ | ------------------------------- | ------------- |
| GET    | `/`                | Get all users                   | No            |
| GET    | `/:id`             | Get user by ID                  | No            |
| POST   | `/register`        | Register a new user             | No            |
| POST   | `/login`           | Login with username/password    | No            |
| POST   | `/logout`          | Log out a user (optional logic) | No            |
| PUT    | `/update-password` | Update user password            | ✅ Yes        |
| DELETE | `/:id`             | Delete a user by ID             | Depends       |

---

## 🐞 Error Handling

All errors are handled by a centralized middleware in:
`middlewares/errorHandler.js`

It supports:

- Custom errors (`ValidationError`, `UnauthorizedError`, etc.)
- Token-related errors
- Auto logging of stack traces

---

## 📝 Logging

Logs are written using `winston` to:

- `logs/combined.log`
- `logs/error.log`
- `logs/debug.log`

Morgan is used for HTTP request logging, integrated into Winston in production.

---

## 📤 Deployment

To deploy:

1. Set environment variables in `.env`
2. Use a platform like **Render**, **Railway**, or **Code Engine**
3. Run in production mode:

```bash
NODE_ENV=production npm start
```

---

## 🛠 Starting a New Project From Template

If you're cloning this template to start a new project, follow these steps:

### 1. Clone the template

```bash
git clone https://github.com/anhkhoa1597/nodejs-backend-template.git my-new-project
cd my-new-project
```

### 2. Rename your project

- Change the folder name (`my-new-project`)
- Edit the `"name"` field in `package.json`
- Update the `README.md` title if needed

### 3. Remove existing Git history

```bash
rm -rf .git
git init
git remote add origin https://github.com/your-username/my-new-project.git
git add .
git commit -m "🎉 Initial commit from backend template"
git push -u origin main
```

Now you have a fresh, customized backend ready to go 🚀

---

## 📚 License

This project is licensed under the MIT License.

---

## 🙌 Credits

Template by Khoa Dang Anh.  
Built with care for real-world scalable backend development.
