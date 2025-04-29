# 💼 Finance Management System (Frontend)

This is the **frontend** for a comprehensive finance management application built using the **MERN stack (MongoDB, Express, React, Node.js)**. This system is designed to streamline and manage financial data for organizations with distinct user roles and access permissions.

## 🚀 Features

### ✅ Role-Based Access (4 Roles)

- **Admin**
  - Manage all users and roles
  - View all projects and data
  - Assign or revoke access

- **Project Manager**
  - Create, update, and view projects
  - Upload and manage project files
  - View statistics, balance sheets, and reports

- **Comptable (Accountant)**
  - Manage financial records and entries
  - View and work on the **Balance General** and **Grand Livre**
  - Upload or download accounting documents

- **Controller**
  - Review and audit projects and financial data
  - Access all generated statistics and financial reports
  - Verify compliance and consistency in reports

---

## 📂 Functional Modules

- **Projects**
  - Create, edit, delete, and view project data
  - Attach supporting documents or financial files

- **Files of Projects**
  - Upload/download documents associated with each project
  - Role-specific visibility and access

- **Statistics**
  - Graphs and tables showing financial KPIs
  - Filtering by project, date range, and user

- **Balance Général**
  - Overview of financial balances grouped by account
  - Generated in real-time from project entries

- **Grand Livre**
  - Detailed ledger for accounting purposes
  - Exportable and printable for audits

- **Users Management**
  - Admin dashboard for managing user roles and access
  - Secure role-based permissions system

---

## 🛠️ Tech Stack

- **React** with `react-router-dom`, `axios`, and `context API`
- **Tailwind CSS / Bootstrap** for styling
- **Ant Design & Lucide Icons** for UI components
- **Redux Toolkit** (if used) for state management
- **React Charts** / `@ant-design/plots` for visualizing data

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/finance-management-frontend.git
cd finance-management-frontend
npm install
🧪 Running the App
bash
Copier le code
npm start
Frontend will be served on: http://localhost:5173

📁 Project Structure
css
Copier le code
src/
├── components/
├── pages/
├── api/
├── context/
├── redux/ (if used)
├── styles/
└── App.jsx
🔐 Authentication & Authorization
JWT-based auth with secure cookie storage

Protected routes for each role using a custom PrivateRoute component

User roles and access control enforced at the frontend and backend

📈 Future Improvements
Export reports to PDF

Real-time collaboration tools

Notifications for project updates or financial events

Support for multi-currency financial data

🧑‍💻 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📄 License
MIT
