# 📊 Finance Management System (Backend)

This is the **backend** for the Finance Management System built with the **MERN stack (MongoDB, Express, React, Node.js)**. It supports **role-based access** for managing financial data, project files, and generating key reports like **Balance Général** and **Grand Livre**.

---

## ⚙️ Features

- 🔐 **Authentication & Authorization**
  - JWT-based login with HTTP-only cookies
  - Middleware for route protection
  - Role-based access control (Admin, Comptable, Project Manager, Controller)

- 📁 **Projects & File Management**
  - CRUD operations for projects
  - Upload and serve documents (PDFs, Excel, etc.)
  - Organized file structure by project ID

- 📊 **Finance Modules**
  - Generate and retrieve **Balance Général**
  - Generate and retrieve **Grand Livre**
  - Entry-level tracking for accounting

- 📈 **Statistics API**
  - Endpoints for financial KPIs and charts
  - Project-level or global financial summaries

- 👥 **User Management**
  - Admin-only routes to create/edit/delete users
  - Assign roles to users
  - Secure password hashing with bcrypt

---

## 📦 Tech Stack

- **Node.js** & **Express.js** – Backend framework
- **MongoDB** & **Mongoose** – Database & ODM
- **Multer** – File uploads
- **JWT (jsonwebtoken)** – Auth
- **bcryptjs** – Password encryption
- **cors**, **dotenv**, **cookie-parser**, etc. – Middleware

---

## 🧱 API Structure
/api/ ├── auth/ # Login & logout ├── users/ # Admin management of users ├── projects/ # Project CRUD + file uploads ├── balance/ # Balance General ├── ledger/ # Grand Livre ├── stats/ # Charts and KPIs

---

## 📁 Folder Structure
backend/ ├── controllers/ ├── models/ ├── routes/ ├── middleware/ ├── uploads/ # Project files stored here ├── config/ # DB and other config ├── index.js └── .env


---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/finance-management-backend.git
cd finance-management-backend

2. Install Dependencies
bash
Copier le code
npm install
3. Create .env File
ini
Copier le code
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
4. Run the Server
bash
Copier le code
npm run dev
Server will run at: http://localhost:3001





