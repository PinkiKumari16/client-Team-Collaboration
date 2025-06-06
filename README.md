# 🧑‍🤝‍🧑 Team Collaboration Platform

A full-stack, real-time team collaboration platform where teams can manage projects, assign and track tasks using a Kanban board, and communicate via team chat. The platform supports **role-based access control**, **real-time messaging**, and **drag-and-drop task management**.

---

## 🔧 Tech Stack

### Frontend
- **React** with **TypeScript**
- **Tailwind CSS** for utility-first styling
- **Firebase Authentication** for user login/registration

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.IO** for real-time chat
- **Joi** for schema validation

### Deployment
- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Render](https://render.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🚀 Live Demo
- **GitHub**: [Server Code](https://github.com/PinkiKumari16/server-Team-Collaboration), [Client Code](https://github.com/PinkiKumari16/client-Team-Collaboration)
- **Frontend**: [Live Frontend URL](https://client-team-collaboration-evf9.vercel.app/)
- **Backend**: [Live API URL](https://server-team-collaboration.onrender.com/)

---

## 🔑 Features

### 👥 Authentication & Authorization
- Secure login and registration via Firebase Auth
- Role-based UI and API access for **Admin**, **Manager**, and **Member**

### 📁 Project Management
- Admins/Managers can **create**, **edit**, and **delete** projects
- Projects are team-specific

### ✅ Task Management (Kanban)
- Tasks grouped by status: `TODO`, `In Progress`, `Done`
- Assign tasks to team members (Managers only)

### 💬 Real-Time Chat
- Team-wide messaging with Socket.IO
- Real-time updates with timestamps and sender details

### 📊 Team Overview
- View list of team members with roles
- Activity log showing task and chat actions

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash[
git clone https://github.com/PinkiKumari16/server-Team-Collaboration.git
git clone https://github.com/PinkiKumari16/client-Team-Collaboration.git
```

### 2. Setup Backend

```
npm install
```

#### 1. 🔐 Environment Variables
Create a .env file inside the server directory with the following content:

```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

#### 2. ▶️ Run the Backend Server
```bash
npm run dev
```
Server will run on: http://localhost:5000

### 3. Setup Frontend

```
npm install
```

#### 1. 🔐 Firebase Config

Create a .env file in the client directory with the following variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_API_URL=http://localhost:5000/api
```

#### 2. Run the Frontend App

```
npm run dev
```
Frontend will be available at: http://localhost:5173

## ✅ Additional Features
- Toast notifications
- User activity logging (task updates, messages sent)

## 📧 Contact
**Pinki**
- pinkikmr2672002@gmail.com
- [LinkedI](https://www.linkedin.com/in/pinki-kumari-42b409257/)

## License
This project was created for evaluation as part of an interview assignment.
