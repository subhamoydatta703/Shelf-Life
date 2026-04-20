# ShelfLife

ShelfLife is a full-stack inventory and expiry-tracking application scaffold built with a React frontend and an Express/MongoDB backend. The current codebase includes a styled authentication UI, Axios-based API wiring on the frontend, and the beginnings of a JWT-based authentication flow on the backend.

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB with Mongoose
- Authentication: bcryptjs, JSON Web Tokens, Joi validation

## Repository Structure

```text
shelflife/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── models/
│   │   └── user.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── LoginPage.css
    │   │   ├── RegisterPage.jsx
    │   │   └── RegisterPage.css
    │   ├── services/
    │   │   ├── api.js
    │   │   └── authService.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Current Status

The project is in an early scaffold stage.

- The frontend includes login and registration pages with a finished visual design.
- The frontend expects API routes at `/api/auth/login` and `/api/auth/register`.
- The backend includes database connection logic, a `User` model, and a partial registration controller.
- Backend route mounting and complete auth endpoint wiring are not finished yet.
- The frontend redirects to `/dashboard`, but a dashboard route is not present yet.

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB instance or MongoDB Atlas connection string

## Getting Started

### 1. Install dependencies

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `backend/` with the following values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Running the Application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

The frontend development server runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:3000`.

## Available Scripts

### Frontend

- `npm run dev`: Start the Vite development server
- `npm run build`: Create a production build
- `npm run preview`: Preview the production build locally

### Backend

- `npm run start`: Start the backend with Node.js
- `npm run dev`: Start the backend with nodemon
- `npm test`: Placeholder test script

## Backend Notes

- `backend/config/db.js` connects Mongoose using `MONGO_URI`
- `backend/models/user.js` defines the `User` schema
- `backend/controllers/authController.js` contains registration validation and token generation logic
- `backend/routes/userRoutes.js` is currently empty and needs route definitions
- `backend/server.js` currently starts Express and connects to MongoDB, but does not mount auth routes yet

## Frontend Notes

- `frontend/src/services/api.js` configures Axios with a `/api` base URL and token interceptor
- `frontend/src/services/authService.js` wraps login and registration API calls
- `frontend/src/App.jsx` currently exposes `/login` and `/register`
- Both auth pages currently redirect to `/dashboard`, which has not been implemented yet



