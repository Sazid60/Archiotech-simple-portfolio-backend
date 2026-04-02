# Archiotech Backend API

Backend API for portfolio authentication and work management.

## Tech Stack

- Node.js
- TypeScript
- Express
- MySQL
- Cloudinary
- JWT (auth)
- Zod (request validation)

## Features

- Admin login with JWT
- JWT stored in httpOnly cookie
- Protected admin routes with role guard
- Portfolio work CRUD
- Image upload to Cloudinary
- Zod validation for request payloads
- Admin auto-seeding on server start

## Project Structure

```text
src/
	config/
		db.ts
	controllers/
		authController.ts
		workController.ts
	interfaces/
		user.interface.ts
		works.interface.ts
	middlewares/
		auth.ts
	models/
		user.model.ts
		works.model.ts
	routes/
		authRoutes.ts
		workRoutes.ts
	services/
		authService.ts
		workService.ts
	utils/
		seedAdmin.ts
	validations/
		requestSchemas.ts
	server.ts
```

## Installed Packages

### Runtime Dependencies

- bcrypt
- cloudinary
- cookie-parser
- dotenv
- express
- jsonwebtoken
- multer
- mysql2
- streamifier
- zod

### Development Dependencies

- typescript
- ts-node
- ts-node-dev
- @types/node
- @types/express
- @types/bcrypt
- @types/jsonwebtoken
- @types/multer
- @types/streamifier
- @types/cookie-parser

## Prerequisites

- Node.js 24 recommended
- MySQL server running
- Cloudinary account

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

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

NODE_ENV=development
```

3. Create required database tables:

```sql
CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	role VARCHAR(50) NOT NULL DEFAULT 'admin'
);

CREATE TABLE works (
	id INT AUTO_INCREMENT PRIMARY KEY,
	image_url TEXT NOT NULL,
	title VARCHAR(255) NOT NULL,
	subtitle VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Run in development:

```bash
npm run dev
```

5. Build and run production:

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` -> start with ts-node
- `npm run build` -> compile TypeScript to `dist`
- `npm start` -> run compiled server from `dist/server.js`

## Working Flow

1. Server starts and loads environment variables.
2. MySQL pool is used for all DB operations.
3. `seedAdmin` checks `ADMIN_EMAIL` and creates admin user if missing.
4. Login endpoint validates payload, verifies password, signs JWT.
5. JWT is returned in response body and also set as httpOnly cookie.
6. Protected routes read token from cookie or `Authorization: Bearer <token>`.
7. For work create/update:
   - image file is uploaded to Cloudinary
   - Cloudinary URL is stored in MySQL.

## Base URL

```text
http://localhost:5000
```

## API Endpoints

### Health

- `GET /`

Success response:

```json
{
  "message": "API is running"
}
```

### Auth

- `POST /api/auth/login`

Body (raw JSON):

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

- `GET /api/works` (public)
- `POST /api/works` (admin only)
- `PUT /api/works/:id` (admin only)
- `DELETE /api/works/:id` (admin only)

## Postman Inputs

### 1) Login

- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Body: raw -> JSON

```json
{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

### 2) Get Works

- Method: `GET`
- URL: `http://localhost:5000/api/works`

### 3) Upload Work

- Method: `POST`
- URL: `http://localhost:5000/api/works`
- Authorization:
  - Use cookie from login automatically in Postman, or
  - Add header: `Authorization: Bearer <token>`
- Body: form-data

| Key   | Type | Value                                                                                       |
| ----- | ---- | ------------------------------------------------------------------------------------------- |
| data  | Text | {"title":"Project title","subtitle":"Project subtitle","description":"Project description"} |
| image | File | Select image file                                                                           |

### 4) Update Work

- Method: `PUT`
- URL: `http://localhost:5000/api/works/1`
- Authorization:
  - Use cookie from login automatically in Postman, or
  - Add header: `Authorization: Bearer <token>`
- Body: form-data

| Key   | Type | Value                                                                                       |
| ----- | ---- | ------------------------------------------------------------------------------------------- |
| data  | Text | {"title":"Updated title","subtitle":"Updated subtitle","description":"Updated description"} |
| image | File | Select image file                                                                           |

### 5) Delete Work

- Method: `DELETE`
- URL: `http://localhost:5000/api/works/1`
- Authorization:
  - Use cookie from login automatically in Postman, or
  - Add header: `Authorization: Bearer <token>`

## Common Errors

- `400 Invalid login payload`
- `401 User not found / Incorrect password`
- `401 No token provided / Invalid token`
- `403 Forbidden`
- `400 No file uploaded`
- `400 Invalid JSON in data field`
- `400 Invalid work payload`
- `404 Work not found`

## Notes

- For multipart requests, keep `data` as valid JSON string.
- Do not manually set `Content-Type` in Postman for form-data; Postman sets it automatically.
- Current `npm run dev` uses `ts-node` without watch mode. Restart server after code changes.
