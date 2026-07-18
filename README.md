# Course Enrollment Management System

A full-stack web application for managing courses, users, and enrollments with role-based access control. The system provides separate dashboards for Students, Instructors, and Admins with secure authentication and course management features.



## Project Overview

The Course Enrollment Management System is a web-based platform that simplifies course management by connecting students, instructors, and administrators.

The application allows users to manage courses, enrollments, student progress, grading, and approval workflows through role-based dashboards.



## Live Application

Backend API:

https://course-enrollment-backend-f5ww.onrender.com

Frontend:

https://course-enrollment-management-system-j8y4tx3ts.vercel.app



# Features

## Authentication and Authorization

- User registration and login
- JWT-based authentication
- Password encryption using bcrypt
- Role-based access control:
  - Student
  - Instructor
  - Admin



## Student Features

- Register and login
- View available courses
- Search courses
- Enroll in courses
- Cancel enrollment requests
- Drop enrolled courses
- Join course waitlists
- Track course progress
- View grades
- Download completion certificates



## Instructor Features

- Create and manage courses
- View enrolled students
- Update student progress
- Manage grades and completion status
- Export student details as CSV



## Admin Features

- Review enrollment requests
- Approve or reject requests
- Manage users and courses
- Monitor platform activities



# Technology Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Framer Motion
- lucide-react
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Database

- MongoDB Atlas

## Deployment

- Vercel
- Render
- MongoDB Atlas



# Project Structure

```
Course_Enrollment_Management_System

│
├── backend
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── services
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```



# Installation and Setup

## Clone Repository

```bash
git clone <repository-url>

cd Course_Enrollment_Management_System
```



# Backend Setup

```bash
cd backend

npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm run dev
```



# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```



# Application Architecture

```
User Browser

        |

React Frontend

        |

Node.js + Express Backend

        |

MongoDB Atlas Database
```



# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |



## Courses

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/courses | Get all courses |
| GET | /api/courses/:id | Get course details |
| POST | /api/courses | Create course |
| PUT | /api/courses/:id | Update course |
| DELETE | /api/courses/:id | Delete course |



## Enrollment

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/enroll/:courseId | Enroll in course |
| DELETE | /api/enroll/:courseId | Drop course |
| GET | /api/enroll/my-courses | View enrolled courses |
| GET | /api/enroll/course/:courseId | View course students |
| PUT | /api/enroll/:enrollmentId | Update enrollment details |



# Environment Variables

The project uses environment variables for sensitive configuration.

Required variables:

```
MONGO_URI
JWT_SECRET
PORT
```

The `.env` file is excluded from GitHub.



# Skills Demonstrated

- Full-stack web development
- REST API development
- MongoDB database design
- Authentication and authorization
- Role-based access control
- React component development
- API integration
- Cloud deployment



# Future Improvements

- Add email notifications
- Add advanced analytics dashboard
- Improve automated testing
- Add additional security features



# Project Type

Full Stack Web Application

Built using:

React + Node.js + Express + MongoDB Atlas

Deployed using:

Vercel + Render