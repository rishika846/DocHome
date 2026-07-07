# DocHome 🩺

DocHome is a modern, full-stack doctor appointment booking platform designed to connect patients, doctors, and administrators seamlessly. It features a complete patient portal, a dedicated admin control panel, and a robust REST API backend.

---

## 🚀 Features

### **Patient Portal (Frontend)**
*   **Search & Filter:** Find doctors instantly by specialty or category.
*   **Appointment Booking:** Select specific dates and active time slots to schedule appointments.
*   **Profile Management:** Edit personal details and upload profile photos securely (stored on Cloudinary).
*   **Appointment History:** Track, view, or cancel upcoming and past appointments.
*   **Premium UX:** Humanised page-loading transitions, button spinners during submissions, and fullscreen logout overlays with backdrop blur.

### **Admin & Doctor Portal (Admin)**
*   **Admin Dashboard:** Add new doctors, configure parameters, and review system-wide bookings.
*   **Doctor Panel:** Manage appointments, view patients, and update doctor profiles.
*   **Doctor Listings:** Control doctor availability switches.

### **API Backend (Server)**
*   **Authentication & Authorization:** Secure user/doctor/admin login using JWT and encrypted passwords (bcrypt).
*   **File Uploads:** Integrated with Cloudinary and Multer for processing image files.
*   **Database Management:** Fast and structured queries using MongoDB and Mongoose.

---

## 🛠️ Technology Stack

*   **Frontend & Admin Panel:** React, Vite, React Router, Tailwind CSS, React Toastify, Axios
*   **Backend:** Node.js, Express.js, MongoDB, Mongoose
*   **Cloud Services:** Cloudinary (Media assets)

---

## 📂 Project Structure

```
DocHome/
├── Backend/          # Node/Express API, database schemas, and routes
├── frontend/         # Patient-facing React web client
└── admin/            # Combined Admin and Doctor panel client
```

---

## ⚙️ Environment Configuration

You need to set up `.env` files for each component to connect the services.

### **1. Backend Environment Setup (`Backend/.env`)**
Create a `.env` file in the `Backend/` directory:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=admin@dochome.com
ADMIN_PASSWORD=your_admin_password
```

### **2. Frontend Environment Setup (`frontend/.env`)**
Create a `.env` file in the `frontend/` directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

### **3. Admin Environment Setup (`admin/.env`)**
Create a `.env` file in the `admin/` directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## 🏃 Getting Started

### **Prerequisites**
Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

### **1. Setup the Backend**
```bash
cd Backend
npm install
# To run in production mode
npm start
# Or to run in development mode (if nodemon is installed)
npm run dev
```

### **2. Setup the Frontend Client**
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` (or the port specified by Vite) in your browser.

### **3. Setup the Admin Portal**
```bash
cd admin
npm install
npm run dev
```
Open `http://localhost:5174` (or the port specified by Vite) in your browser.

---

## 🔒 Security & Optimization Best Practices

*   **Lean Mongoose Queries:** Utilizing `.lean()` for read-only queries to bypass model hydration and save backend memory.
*   **Secure API Routers:** API inputs are validated, and secure headers are recommended for production setups.
*   **Dynamic Image Optimization:** Cloudinary URLs are queried using format and quality automation parameters to minimize bundle loads.
