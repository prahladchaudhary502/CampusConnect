
***

# CampusConnect

**Campus Connect** is a full-stack MERN web application built to connect campus communities via blogs, notices, and threaded comments. It features user roles (student, faculty, admin, moderator, alumni), approval workflows for posts, and a real-time interactive comment system with both authenticated and guest support.

***

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

***

## Features

- User roles: **Student, Faculty, Admin, Moderator, Alumni**
- CRUD for blogs, notices, and comments
- Blog/notice approval & moderation flows
- Threaded comments (with replies) for users and guests
- Responsive dashboard with admin tabs
- Authentication and session support
- Notifications for comments and moderation
- Deployed using Vercel (frontend) & Render (backend)

***

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, DaisyUI, react-hot-toast
- **State Management:** React Context (`AppContext`)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Deployment:** Vercel (frontend), Render (backend)
- **Testing/Utils:** Axios, React Testing Library (optional)

***

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/campus-fonnect.git
   cd campus-fonnect
   ```

2. **Install dependencies:**
   - For the frontend:
     ```bash
     cd client
     npm install
     ```
   - For the backend:
     ```bash
     cd ../server
     npm install
     ```

3. **Environment Setup:**
   - Create a `.env` file in both `/client` and `/server` and add required variables (`VITE_BASE_URL`, MongoDB URI, auth secrets, etc.)

4. **Run development servers:**
   ```bash
   # In one terminal (frontend)
   cd client
   npm start

   # In another terminal (backend)
   cd server
   npm start
   ```

***

## Available Scripts

| Command            | Description                           |
|--------------------|---------------------------------------|
| `npm start`        | Runs the app in development mode      |
| `npm run build`    | Builds the app for production         |
| `npm run test`     | Runs test suites                      |
| `npm run lint`     | Lint/fix source code (if configured)  |

***

## API Overview

Main REST endpoints:

- `/api/user` — Auth, profile, roles
- `/api/blog` — Blog CRUD, moderation
- `/api/notice` — Notice CRUD
- `/api/comments` — Comments (auth/guest), thread structure
- `/api/notifications` — User notifications

See `/server/README.md` for detailed schema and request examples.

***

## Usage

- Register/Login with campus or guest identity
- Write or comment on blogs and notices
- Admins/moderators can approve, reject, or delete posts
- Real-time feedback via toasts and notifications
- Discuss and collaborate with campus community safely

***

## Contributing

PRs and issues are welcome!  
- Fork the repo, create a branch, make changes, and submit a pull request.
- Please document major changes and add tests where relevant.

***

## License

This project is licensed under the [MIT License](LICENSE).

***
