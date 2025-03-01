# NestJS User Management & Document Management API

## Overview
This project is a **NestJS backend service** for user authentication, user management, document management, and ingestion controls. It includes **role-based access control (RBAC)** and integrates **PostgreSQL** as the database.

## Features
- **Authentication:** User registration, login, logout, JWT-based authentication.
- **User Management:** CRUD operations for users with role-based permissions.
- **Document Management:** Upload, fetch, update, and delete documents.
- **Ingestion API:** Trigger ingestion process and track ongoing ingestion tasks.
- **Microservices Architecture:** Scalable and modular design.

## Tech Stack
- **NestJS** (Node.js framework)
- **TypeScript**
- **PostgreSQL** with **TypeORM**
- **JWT Authentication**
- **bcrypt** (Password hashing)
- **Swagger** (API documentation)

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- PostgreSQL

### Clone the Repository
```bash
git clone https://github.com/your-repo.git
cd your-repo
```

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
Create a `.env` file and configure the necessary variables:
```env
DATABASE_URL=postgres://user:password@localhost:5432/mydatabase
JWT_SECRET=your_jwt_secret
PORT=3000
```

### Run the Application
```bash
npm run start:dev
```

## API Documentation

### Authentication APIs

#### **Register User**
`POST /auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "viewer"
}
```
**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "viewer"
}
```

#### **Login**
`POST /auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "access_token": "jwt_token_here"
}
```

#### **Logout**
`POST /auth/logout`
**Response:**
```json
{
  "message": "Logout successful"
}
```

---
### User Management APIs (Admin Only)

#### **Get All Users**
`GET /users`
**Response:**
```json
[
  { "id": 1, "email": "admin@example.com", "role": "admin" },
  { "id": 2, "email": "editor@example.com", "role": "editor" }
]
```

#### **Update User Role**
`PATCH /users/:id/role`
```json
{
  "role": "admin"
}
```
**Response:**
```json
{
  "id": 2,
  "email": "user@example.com",
  "role": "admin"
}
```

#### **Delete User**
`DELETE /users/:id`
**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---
### Document Management APIs

#### **Upload Document**
`POST /documents/upload`
**Headers:** `Authorization: Bearer <JWT>`

**Form-Data:**
- `file`: Upload a document file.

**Response:**
```json
{
  "id": 1,
  "filename": "document.pdf",
  "uploadedBy": "admin@example.com"
}
```

#### **Get All Documents**
`GET /documents`
**Response:**
```json
[
  { "id": 1, "filename": "doc1.pdf", "uploadedBy": "admin@example.com" },
  { "id": 2, "filename": "doc2.docx", "uploadedBy": "user@example.com" }
]
```

#### **Delete Document**
`DELETE /documents/:id`
**Response:**
```json
{
  "message": "Document deleted successfully"
}
```

---
### Ingestion APIs

#### **Trigger Ingestion Process**
`POST /ingestion/trigger`
```json
{
  "documentId": 1
}
```
**Response:**
```json
{
  "message": "Ingestion process started for documentId 1"
}
```

#### **Get Ingestion Status**
`GET /ingestion/status/:id`
**Response:**
```json
{
  "documentId": 1,
  "status": "Processing"
}
```

## Running Tests
To run unit tests:
```bash
npm run test
```

To run integration tests:
```bash
npm run test:e2e
```

## Deployment
To build the project:
```bash
npm run build
```
To start in production mode:
```bash
npm run start:prod
```

## Contributors
- **Harsh Verma** - Developer

## License
This project is licensed under the MIT License.

