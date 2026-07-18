# Course Enrollment Management System

A full-stack web application for managing courses, users, and enrollments with role-based access control. The system provides separate dashboards for Students, Instructors, and Admins with secure authentication and course management features.



## Project Overview

The Course Enrollment Management System is designed to simplify online course management by providing a platform where students, instructors, and administrators can manage courses and enrollment activities.

The system includes:

- User authentication and authorization
- Role-based access control
- Course creation and management
- Student enrollment management
- Instructor dashboard
- Admin approval workflow
- Student progress and grading management



# Features

## Authentication and Authorization

- User registration and login
- JWT-based authentication
- Password encryption using bcrypt
- Role-based access:
  - Student
  - Instructor
  - Admin


## Student Features

Students can:

- Register and login
- View available courses
- Search and explore courses
- Enroll in courses
- Drop enrolled courses
- Join course waitlists
- View enrolled courses
- Track course progress
- Download completion certificates



## Instructor Features

Instructors can:

- Create new courses
- Manage their courses
- View enrolled students
- Update student progress
- Update grades and completion status
- Export student details as CSV


## Admin Features

Admins can:

- Review pending enrollment requests
- Approve or reject requests
- Manage course and user activities



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



# Project Structure

```
Course_Enrollment_Management_System

│
├── backend
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

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```


# Frontend Setup

Open another terminal and navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend application:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```



# Application Architecture

```
User Browser

        |
        |

React Frontend
(localhost:5173)

        |
        |

Node.js + Express Backend
(localhost:5000)

        |
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

Sensitive information is not included in the repository.

The backend uses environment variables for:

- MongoDB connection string
- JWT secret key
- Server port configuration

A sample file is provided:

```
.env.example
```



# Skills Demonstrated

This project demonstrates:

- Full-stack web development
- REST API development
- Database design using MongoDB
- Authentication and authorization
- Role-based access control
- React component development
- API integration
- Cloud database integration



# Future Improvements

- Add email notifications
- Add advanced analytics
- Improve automated testing
- Enhance deployment workflow



# Project Type

Full Stack Web Application

Built using:

React + Node.js + Express + MongoDB Atlas