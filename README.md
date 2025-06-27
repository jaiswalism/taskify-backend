# 🗄️ Taskify Backend

Taskify Backend is a secure RESTful API built with **Express.js** and **MongoDB**. It powers the Taskify task management app, providing endpoints for user authentication and personal task management.

---

## ✨ Features

- **User Authentication:**  
  - Signup and login with JWT-based session management.
  - Passwords are securely hashed with bcrypt.
  - Input validation with Zod for strong security.
  - All protected routes require a valid token.

- **Task Management:**  
  - Create, read, update, and delete your own tasks.
  - Strict validation for all fields and enums.
  - Each task supports title, description, priority tag, deadline, status (section), and done flag.
  - Fetch all tasks or a specific task by ID.

- **Secure & Modular:**  
  - All user and task data is scoped per user.
  - Modular route structure for users and todos.
  - Uses environment variables for secrets and database config.

---

## 🛠️ Tech Stack

- **Node.js** & **Express.js** – Core server and routing
- **MongoDB** & **Mongoose** – Database and models
- **jsonwebtoken** – JWT authentication
- **bcrypt** – Password hashing
- **zod** – Input validation
- **dotenv** – Environment configuration
- **cors** – Cross-origin support

---

## 📁 Project Structure

```bash
taskify-backend/
│
├── index.js # Entry point for the Express app
├── database/ # MongoDB models (User, Todo)
├── middleware/ # Authentication middleware
├── routes/
│ ├── user.js # User authentication and user-specific routes
│ └── todo.js # Task CRUD routes
├── package.json
├── .env.example # Example environment variables
├── package.json
├── .env # Environment variables 
└── README.md
```


---

## 🚀 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/jaiswalism/taskify-backend.git
cd taskify-backend
```


### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Environment Variables**

- Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

- Fill in your actual values in the `.env` file:

| Variable      | Description                             |
|---------------|-----------------------------------------|
| MONGODB_URI   | Your MongoDB connection string          |
| JWT_SECRET    | Secret key for JWT token signing        |
| PORT          | Port number for the server (e.g. 3000)  |


### 4. **Run the Server**

npm run dev


The API will be available at `http://localhost:3000` (or your specified port).

---

## 🛡️ API Routes

All protected routes require a valid JWT token in the `Authorization` header.

### **Authentication & User**

- `POST /signup`  
  Register a new user (`name`, `email`, `password`).

- `POST /login`  
  Log in and receive a JWT token (`email`, `password`).

- `POST /logout`  
  Log out the current user.

- `GET /todos`  
  Get all todos for the authenticated user.

### **Todo Operations**

- `POST /`  
  Create a new todo (`title`, `description`, `tag`, `deadline`, `section`).

- `PUT /`  
  Update an existing todo by matching `title` and `description` (fields: `title`, `description`, plus new values: `newTitle`, `newDescription`, `newTag`, `newDeadline`, `newSection`).

- `DELETE /`  
  Delete a todo by matching `title`, `description`, and `tag`.

- `DELETE /:id`  
  Delete a todo by its unique ID.

- `GET /`  
  Get all todos for the authenticated user.

- `GET /:id`  
  Get a single todo by its unique ID.


---

## 📣 Notes

- Make sure MongoDB is running and accessible.
- This backend is designed to work seamlessly with the [Taskify Frontend](https://github.com/jaiswalism/taskify-frontend).
- See `.env.example` for required environment variables.
- All input is validated and passwords are securely hashed for your safety.