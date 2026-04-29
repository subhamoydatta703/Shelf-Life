# ShelfLife

ShelfLife is a full-stack household inventory and expiry-tracking app. It lets users register or log in, create or join a household with an invite code, add shared inventory items, and track whether items are fresh, expiring soon, expired, used, or wasted.

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JSON Web Tokens, bcryptjs, Joi validation

## Features

- User registration and login with JWT-based sessions
- Protected dashboard route
- Household creation with generated invite codes
- Join an existing household by invite code
- Shared household inventory
- Add, list, update, and delete items
- Derived expiry status for fresh, expiring soon, and expired items
- Item actions for marking items as used or wasted

## Repository Structure

```text
shelflife/
|-- backend/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- householdController.js
|   |   `-- itemController.js
|   |-- middleware/
|   |   `-- auth.js
|   |-- models/
|   |   |-- household.js
|   |   |-- item.js
|   |   `-- user.js
|   |-- routes/
|   |   |-- householdRoutes.js
|   |   |-- itemRoutes.js
|   |   `-- userRoutes.js
|   |-- package.json
|   `-- server.js
`-- frontend/
    |-- src/
    |   |-- pages/
    |   |   |-- DashboardPage.jsx
    |   |   |-- LoginPage.jsx
    |   |   `-- RegisterPage.jsx
    |   |-- services/
    |   |   |-- api.js
    |   |   `-- authService.js
    |   |-- App.jsx
    |   |-- index.css
    |   `-- main.jsx
    |-- index.html
    |-- package.json
    `-- vite.config.js
```

## Prerequisites

- Node.js 18 or newer
- npm
- A local MongoDB instance or MongoDB Atlas connection string

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Create `frontend/.env` if you want the frontend API client to target a specific backend URL:

```env
REACT_APP_SERVER_URL=http://localhost:3000
```

The Vite dev server also proxies `/api` requests to `http://localhost:3000`, as configured in `frontend/vite.config.js`.

## Getting Started

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173`. The backend runs at `http://localhost:3000` by default.

## Available Scripts

Backend:

- `npm run dev`: Start the Express server with nodemon
- `npm start`: Start the Express server with Node
- `npm test`: Placeholder test script

Frontend:

- `npm run dev`: Start the Vite development server
- `npm run build`: Build the frontend for production
- `npm run preview`: Preview the production build locally

## API Routes

All current backend routes are mounted under `/api/auth`.

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Register a user, optionally with an invite code |
| `POST` | `/api/auth/login` | No | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Yes | Return the authenticated user |
| `POST` | `/api/auth/household/create` | Yes | Create a household for the current user |
| `POST` | `/api/auth/household/join` | Yes | Join a household by invite code |
| `GET` | `/api/auth/household` | Yes | Get the current user's household |
| `POST` | `/api/auth/items/create` | Yes | Add an inventory item |
| `GET` | `/api/auth/items` | Yes | List inventory items for the user's household |
| `PUT` | `/api/auth/items/:id` | Yes | Update an inventory item |
| `DELETE` | `/api/auth/items/:id` | Yes | Delete an inventory item |

Authenticated requests must include:

```http
Authorization: Bearer <token>
```

## Data Models

`User` stores a name, unique email, hashed password, and optional `householdId`.

`Household` stores a name, unique invite code, member user IDs, and creation date.

`Item` stores household ownership, creator, name, category, quantity, expiry date, status, and creation date.

Valid item categories are `produce`, `dairy`, `meat`, `pantry`, `frozen`, and `other`.

Valid item statuses are `fresh`, `expiring-soon`, `expired`, `used`, and `wasted`.

## Notes

- JWTs are currently signed with a one-hour expiration.
- Household inventory is scoped by the authenticated user's `householdId`.
- The dashboard derives fresh, expiring soon, and expired states from `expiryDate` unless an item has been marked `used` or `wasted`.
- There are no automated tests yet; the backend test script is still a placeholder.
