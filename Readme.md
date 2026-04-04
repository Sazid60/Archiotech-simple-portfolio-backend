# Archiotech Backend API

Express + TypeScript backend for portfolio authentication and work management.

## Overview

This API provides:

- Admin login with JWT
- Token delivery in both cookie and JSON response
- Role-based route protection for admin-only write operations
- Portfolio works CRUD
- Image upload to Cloudinary
- Zod request validation
- In-memory rate limiting
- Automatic MySQL table initialization and admin seeding on startup

## Tech Stack

- Node.js
- TypeScript
- Express 5
- MySQL (mysql2)
- Cloudinary
- JWT (jsonwebtoken)
- Zod
- Multer

## Project Structure

```text
src/
  app.ts
  server.ts
  app/
    config/
      cloudinary.config.ts
      db.ts
      multer.config.ts
    errors/
      ApiError.ts
    middlewares/
      auth.ts
      globalErrorHandler.ts
      notFound.ts
      rateLimiter.ts
      validateRequest.ts
    modules/
      controllers/
        authController.ts
        workController.ts
      interfaces/
        user.interface.ts
        works.interface.ts
      models/
        user.model.ts
        works.model.ts
      routes/
        authRoutes.ts
        workRoutes.ts
      services/
        authService.ts
        workService.ts
      validations/
        requestSchemas.ts
    shared/
      catchAsync.ts
      sendResponse.ts
    utils/
      initDb.ts
      seedAdmin.ts
      setCookie.ts
      setToken.ts
      userToken.ts
```

## Environment Variables

Create a .env file in the project root:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=archiotech
DB_PORT=3306

JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123456

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

NODE_ENV=development
```

Notes:

- CORS_ORIGIN supports comma-separated origins.
- CORS_CREDENTIALS must be true if you want browser cookie auth across origins.
- JWT_SECRET is required for token creation/verification.

## Database Setup

You do not need to manually create tables. On startup the app runs initDb() and creates tables if missing:

- users
- works

It also runs seedAdmin() and inserts an admin user from ADMIN_EMAIL and ADMIN_PASSWORD if that admin does not already exist.

## Installation

```bash
npm install
```

## Run

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Production (after build):

```bash
npm start
```

## Scripts

- npm run dev: runs ts-node src/server.ts
- npm run build: compiles TypeScript with tsc
- npm start: runs dist/server.js

## Base URL

```text
http://localhost:5000
```

## Auth Behavior

- Login returns a JWT in JSON response body: { token: "..." }
- Login also sets an httpOnly cookie named token
- Protected routes accept token from either:
  - Cookie: token
  - Authorization header: Bearer <token>
- Token expiration is 1 hour

Cookie options:

- httpOnly: true
- maxAge: 1 hour
- secure: true only in production
- sameSite: none in production, lax otherwise

## Rate Limiting

- Global API limiter:
  - 1000 requests / 15 minutes / IP
- Auth limiter on POST /api/auth/login:
  - 59 attempts / 15 minutes / IP
  - Successful auth responses reduce the count (skipSuccessfulRequests behavior)

## API Endpoints

### Health

GET /

Response:

```json
{
  "message": "API is running"
}
```

### Auth

POST /api/auth/login

Body:

```json
{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

Success response:

```json
{
  "token": "<jwt-token>"
}
```

### Works

GET /api/works (public)

Success response:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Works fetched successfully",
  "data": [
    {
      "id": 1,
      "image_url": "https://...",
      "title": "Project title",
      "subtitle": "Project subtitle",
      "description": "Project description",
      "created_at": "2026-04-04T10:10:10.000Z"
    }
  ]
}
```

POST /api/works (admin only)

- Content-Type: multipart/form-data
- Required fields:
  - image (file)
  - data (stringified JSON)

Example data value:

```json
{"title":"Project title","subtitle":"Project subtitle","description":"Project description"}
```

Success response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Work uploaded",
  "data": {
    "id": 1,
    "image_url": "https://...",
    "title": "Project title",
    "subtitle": "Project subtitle",
    "description": "Project description"
  }
}
```

PUT /api/works/:id (admin only)

- Content-Type: multipart/form-data
- data is required (stringified JSON)
- image is optional
- data supports partial updates

Example data value:

```json
{"title":"Updated title"}
```

Success response:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Work updated",
  "data": {
    "id": 1,
    "image_url": "https://...",
    "title": "Updated title",
    "subtitle": "Project subtitle",
    "description": "Project description"
  }
}
```

DELETE /api/works/:id (admin only)

Success response:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Work deleted",
  "data": null
}
```

## Validation Rules

- Login:
  - email must be valid email
  - password minimum 6 characters
- Create work:
  - title, subtitle, description required (non-empty strings)
- Update work:
  - title, subtitle, description optional
- For create/update route body:
  - data must be a valid JSON string
- Path id:
  - must be a positive integer

## Error Response Behavior

Global error handler returns:

```json
{
  "success": false,
  "message": "Something went wrong!",
  "error": {}
}
```

Possible messages include:

- No token provided (401)
- Invalid token (401)
- Forbidden (403)
- User not found (401)
- Incorrect password (401)
- No file uploaded (400)
- Validation error (400)
- Too many login attempts, please try again later. (429)
- Too many requests from this IP, please try again later. (429)
- API NOT FOUND! (404)

Important implementation note:

- Some not-found conditions in work service currently throw generic Error("Work not found"), which is returned as 500 by the current global error handling logic.

## Postman Tips

1. Login first using POST /api/auth/login.
2. Reuse cookie automatically in Postman, or use Authorization: Bearer <token>.
3. For multipart requests, send data as valid JSON string.
4. Do not manually set multipart Content-Type; Postman will set it with boundary.

## Current Limitations

- No automated tests yet.
- No refresh token flow.
- In-memory rate limiter resets on server restart and is not shared across instances.
- Cloudinary deletion failures in safe cleanup are intentionally swallowed during rollback cleanup paths.
