# TeamFlow — Full-Stack Team Task Management Platform

TeamFlow is a modern full-stack SaaS-style team collaboration and task management platform designed for managing projects, assigning tasks, tracking productivity, and enforcing secure role-based workflows.

Built with a production-ready architecture, TeamFlow provides enterprise-style project management features with a responsive UI, analytics dashboards, secure JWT authentication, and scalable REST API integration.

The platform was developed as part of the Ethara.AI Full-Stack Application Assessment to demonstrate full-stack engineering capabilities, backend architecture design, database management, authentication systems, role-based access control, responsive frontend engineering, and deployment workflows.

---

# Problem Statement

Organizations and teams often struggle with:
- inefficient task coordination,
- lack of centralized workflow tracking,
- poor visibility into project progress,
- communication gaps,
- and limited productivity monitoring.

Traditional task tracking methods become difficult to manage when teams grow larger and projects become more complex.

TeamFlow solves these problems by offering:
- centralized project management,
- secure role-based workflows,
- project collaboration,
- task assignment systems,
- productivity analytics,
- and responsive dashboard experiences.

---

# Key Objectives

The primary objectives of TeamFlow include:

- Build a scalable full-stack SaaS application
- Implement secure authentication and authorization
- Provide enterprise-level project management
- Enable task assignment and workflow tracking
- Create responsive and accessible UI/UX
- Design RESTful backend APIs
- Integrate MongoDB database architecture
- Demonstrate production-ready deployment workflows

---

# Live Deployment

## Frontend
https://teamflow-workspace.vercel.app/

## Backend API
https://teamflow-backend-8aar.onrender.com

---

# Core Features

# Authentication & Security
- JWT-based authentication
- Secure login/signup system
- Password hashing using bcryptjs
- Protected routes
- Role-based access control (RBAC)
- Persistent authentication state
- Secure middleware-based authorization
- API-level access protection
- Session persistence
- Validation handling
- Error handling for invalid credentials

---

# Role-Based Access Control

The platform implements secure RBAC architecture with different permissions for administrators and members.

---

## Admin Capabilities

Administrators have complete access to platform management features including:

- Create projects
- Edit projects
- Delete projects
- Create tasks
- Assign tasks to members
- Update workflow statuses
- Manage project members
- View dashboard analytics
- Delete users
- Monitor overdue tasks
- Track productivity metrics
- Manage team workflows

---

## Member Capabilities

Members have limited and protected access including:

- View assigned projects
- Access assigned tasks only
- Update task progress
- Change task status
- Track due dates
- Monitor personal workflow
- Access restricted dashboard data

---

# Project Management

The application includes a complete project management system with:

- Project creation
- Project editing
- Project deletion
- Team member assignment
- Project descriptions
- Status management
- Project filtering
- Search functionality
- Responsive project cards
- Pagination support

---

# Task Management

The task management module enables teams to efficiently manage workflows.

Features include:
- Create tasks
- Assign tasks to members
- Configure due dates
- Set task priorities
- Update statuses
- Track overdue tasks
- Filter and search tasks
- Analytics integration
- Workflow lifecycle management

---

# Supported Task Statuses

- Todo
- In Progress
- Review
- Completed

---

# Supported Priority Levels

- Low
- Medium
- High

---

# Dashboard & Analytics

The analytics dashboard provides productivity and workflow insights through interactive visualizations.

Features include:
- Project statistics
- Task analytics
- Status distribution charts
- Priority distribution charts
- Productivity insights
- Recent activity tracking
- Overdue task indicators
- Recharts-based visual analytics
- Workflow summary cards

---

# UI/UX Features

The frontend was designed using modern SaaS UI principles.

Features include:
- Modern SaaS-inspired UI
- Fully responsive layouts
- Dark professional theme
- Sidebar navigation
- Reusable UI components
- Toast notifications
- Loading states
- Empty states
- Error boundaries
- Mobile-friendly layouts
- Responsive dashboard cards
- Interactive hover states
- Smooth transitions and animations
- Optimized typography and spacing

---

# Technical Architecture

The application follows a modern client-server architecture.

## Frontend Responsibilities
- User interface rendering
- Client-side routing
- Form validation
- API communication
- State management
- Authentication persistence
- Dashboard visualizations

## Backend Responsibilities
- REST API implementation
- Authentication logic
- Authorization middleware
- Database communication
- Validation handling
- Business logic processing
- Security enforcement

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Zod
- Recharts
- Lucide React Icons

---

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Express Validator

---

# Additional Development Utilities

- ESLint
- Nodemon
- dotenv
- CORS middleware
- Async error handling middleware
- REST API utilities

---

# Project Structure

```bash
teamflow-fullstack-app/
│
├── client/        # Frontend (React + Vite)
│
├── server/        # Backend REST API
│
└── README.md
```

---

# Detailed Folder Structure

```bash
teamflow-fullstack-app/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── context/
│   │   └── assets/
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# Database Design

MongoDB Atlas is used as the cloud database solution.

## Collections

### Users Collection
Stores:
- user name
- email
- password
- role
- timestamps

### Projects Collection
Stores:
- project title
- description
- members
- project owner
- status

### Tasks Collection
Stores:
- task title
- description
- priority
- status
- due date
- assigned user
- related project

---

# Security Features

The platform includes multiple security mechanisms:

- JWT token authorization
- Password hashing
- Route protection
- API authorization middleware
- Role-based access control
- Protected admin routes
- Input validation
- Error sanitization
- Secure authentication flows

---

# API Documentation

Base URL:

```txt
/api
```

---

# Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login existing user |
| GET | `/auth/me` | Get authenticated user |

---

# Project APIs

| Method | Endpoint | Access |
|---|---|---|
| GET | `/projects` | Authenticated |
| POST | `/projects` | Admin |
| GET | `/projects/:id` | Authenticated |
| PUT | `/projects/:id` | Admin |
| DELETE | `/projects/:id` | Admin |

---

# Task APIs

| Method | Endpoint | Access |
|---|---|---|
| GET | `/tasks` | Authenticated |
| POST | `/tasks` | Admin |
| PUT | `/tasks/:id` | Authenticated |
| DELETE | `/tasks/:id` | Admin |
| PATCH | `/tasks/:id/status` | Authenticated |
| GET | `/tasks/analytics/summary` | Authenticated |

---

# User APIs

| Method | Endpoint | Access |
|---|---|---|
| GET | `/users` | Admin |
| GET | `/users/:id` | Authenticated |

---

# Environment Variables

# Backend Environment Variables

```env
PORT=5000
NODE_ENV=production

MONGO_URI=your_mongodb_uri
MONGO_DB_NAME=teamflow

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=https://teamflow-workspace.vercel.app
```

---

# Frontend Environment Variables

```env
VITE_API_URL=https://teamflow-backend-8aar.onrender.com/api
```

---

# Local Development Setup

# Step 1 — Clone Repository

```bash
git clone <repository-url>
```

---

# Step 2 — Install Dependencies

## Backend

```bash
cd server
npm install
```

## Frontend

```bash
cd client
npm install
```

---

# Step 3 — Configure Environment Files

Create:

```bash
server/.env
client/.env
```

and add the required variables.

---

# Step 4 — Run Backend

```bash
cd server
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Step 5 — Run Frontend

```bash
cd client
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Deployment

# Frontend Deployment
Platform: Vercel

Deployment Features:
- Automatic CI/CD
- Global CDN delivery
- HTTPS enabled
- Production environment support

---

# Backend Deployment
Platform: Render

Deployment Features:
- Node.js server hosting
- Environment variable support
- Automatic redeployment
- Cloud deployment architecture

---

# Database Hosting
Platform: MongoDB Atlas

Features:
- Cloud-hosted database
- Secure database access
- Scalable architecture
- Managed backups

---

# Performance Optimizations

The application includes several optimization techniques:

- Lazy-loaded frontend routes
- Optimized API calls
- Reusable components
- Pagination support
- Centralized API services
- Efficient MongoDB queries
- Responsive rendering
- Modular architecture

---

# Error Handling

The application handles:
- authentication errors,
- invalid routes,
- API failures,
- validation errors,
- unauthorized access,
- loading states,
- empty states,
- backend exceptions.

---

# Future Enhancements

Future improvements planned for TeamFlow include:

- Real-time notifications
- WebSocket integration
- Drag-and-drop Kanban board
- Team chat system
- File attachments
- Email notifications
- Calendar integration
- Audit activity logs
- AI-powered productivity insights
- Advanced analytics dashboards
- Workspace-level organization systems

---

# Demo Credentials

Create manually using signup after deployment.

## Admin Account
Email: admin@teamflow.app  
Password: Admin@123

## Member Account
Email: member@teamflow.app  
Password: Member@123

---

# Assessment Evaluation Coverage

This project fully satisfies the evaluation requirements for:

- Authentication & User Flow
- Project & Task Management
- Dashboard & Data Presentation
- Role-Based Access Control
- Validation & Error Handling
- REST API Design
- Database Relationships
- Responsive UI/UX
- Professional SaaS Design
- Deployment & Production Readiness

---

# Learning Outcomes

This project demonstrates practical understanding of:
- full-stack application architecture,
- REST API development,
- authentication systems,
- MongoDB schema design,
- responsive frontend engineering,
- deployment workflows,
- cloud hosting platforms,
- scalable backend patterns,
- modern React development practices.

---

# Author

## Mohammad Riyazuddin
B.Tech — Computer Science Engineering (AI & ML)

Built for the Ethara.AI Full-Stack Application Assessment.

---
```
