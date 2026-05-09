# TeamFlow - Full-Stack Team Task Management SaaS

TeamFlow is a production-ready full-stack task management platform with role-based access control, project/task workflows, analytics dashboard, and deployment-ready architecture.

## Features

- JWT authentication (signup/login/me) with bcrypt password hashing
- Role-based access control (`admin`, `member`)
- Project management (create/read/update/delete for admin)
- Task management (assign, track status, priority, due dates, overdue states)
- Search, filter, sort, and pagination for list APIs
- Dashboard analytics with Recharts (status/priority distributions + activity)
- Responsive SaaS-style UI (dark theme, badges, cards, sidebar)
- Toast notifications, loading states, empty states, 404 handling
- Railway-ready backend and Vercel-ready frontend setup

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- shadcn/ui-style reusable components
- React Router DOM
- Axios
- React Hook Form + Zod
- Recharts
- Lucide Icons

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT + bcryptjs
- Express Validator

## Project Structure

- `client/` - Frontend application
- `server/` - Backend REST API

## Local Setup

### 1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Configure environment files

Server: copy `server/.env.example` to `server/.env`

Client: copy `client/.env.example` to `client/.env`

### 3) Run apps

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## Environment Variables

### Server (`server/.env`)

- `PORT` - API port (default 5000)
- `NODE_ENV` - `development` or `production`
- `MONGO_URI` - MongoDB Atlas connection URI
- `MONGO_DB_NAME` - Database name
- `JWT_SECRET` - Secret key for signing JWTs
- `JWT_EXPIRES_IN` - Token expiry (e.g. `7d`)
- `CLIENT_URL` - Frontend URL for CORS

### Client (`client/.env`)

- `VITE_API_URL` - Backend API base URL (e.g. `http://localhost:5000/api`)

## API Documentation

Base URL: `/api`

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

### Projects
- `GET /projects`
- `POST /projects` (admin)
- `GET /projects/:id`
- `PUT /projects/:id` (admin)
- `DELETE /projects/:id` (admin)

### Tasks
- `GET /tasks`
- `POST /tasks` (admin)
- `PUT /tasks/:id`
- `DELETE /tasks/:id` (admin)
- `PATCH /tasks/:id/status`
- `GET /tasks/analytics/summary`

### Users
- `GET /users`
- `GET /users/:id`

## Deployment

### Backend on Railway

1. Create a new Railway project and connect the repo.
2. Set root directory to `server`.
3. Add environment variables from `server/.env.example`.
4. Railway build command: `npm install`
5. Railway start command: `npm start`
6. Use generated Railway URL as API URL.

### Frontend on Vercel

1. Import repo to Vercel.
2. Set root directory to `client`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL=<Railway_API_URL>/api`
6. Deploy.

## Demo Credentials (Create Manually)

Create through signup page after first deploy:
- Admin: `admin@teamflow.app` / `Admin@123`
- Member: `member@teamflow.app` / `Member@123`

## Evaluation Checklist Coverage

- Authentication and user flow
- Role-based permissions and protected routes
- Project/task management UI and APIs
- Dashboard analytics and visual charts
- Validation, loading, error, and empty states
- Responsive polished UI and deploy-ready setup
