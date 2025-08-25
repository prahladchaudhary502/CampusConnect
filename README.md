# QuickBlog

QuickBlog is a modern AI-powered blogging platform built with React, Node.js, and MongoDB. It allows users to create, publish, and manage blogs with features like AI-generated content, image optimization, real-time comments, and an admin dashboard.

---

## Features

- ✍️ **Create & Publish Blogs:** Write, edit, and publish blogs with rich text formatting.
- 🤖 **AI Content Generation:** Generate blog content using Google Gemini AI.
- 🖼️ **Image Upload & Optimization:** Upload images and optimize them automatically.
- 🗂️ **Categories:** Organize blogs by categories.
- 💬 **Comments:** Users can comment on blogs; admin can approve or delete comments.
- 🛡️ **Admin Dashboard:** Manage blogs, comments, and drafts.
- 🔒 **Authentication:** Admin login and user registration.
- 📈 **Responsive UI:** Built with TailwindCSS for a modern look and feel.

---

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **AI Integration:** Google Gemini API
- **Image Handling:** ImageKit, Multer
- **Authentication:** JWT, bcrypt
- **Notifications:** react-hot-toast

---

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- ImageKit account (for image uploads)
- Google Gemini API key

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/quickblog.git
cd quickblog

2. Install dependencies
cd server
npm install

cd [client](http://_vscodecontentref_/0)
npm install

3. Configure Environment Variables
Create .env files in both server and client folders.

server/.env

MONGO_URI=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
GEMINI_API_KEY=your_gemini_api_key
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret

VITE_API_URL=http://localhost:5000

4. Start the Application
Start Backend:
cd server
npm run server

Start Frontend:
cd client
npm run dev

Usage
Visit http://localhost:5173 to access the app.
Use /admin for the admin dashboard.
Register a new account via /register.
Create, edit, and manage blogs and comments.

Acknowledgements
React
Vite
TailwindCSS
Node.js
Express
MongoDB
ImageKit
Google Gemini
