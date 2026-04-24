# Flight Status System - Backend

Production-ready Node.js + Express + MongoDB backend for managing flight schedules with JWT authentication, role-based access control, and audit logging.

**Status:** Production Ready  
**Repository:** https://github.com/monojoycodes/flight-status-system

---

## Overview

REST API for flight schedule management with:
- JWT token-based authentication
- Role-based access control (ARL, AOT, USR)
- Flight CRUD operations with pagination and filtering
- Input validation and error handling
- Audit trail for all operations

---

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account

---

## Installation

```bash
git clone https://github.com/monojoycodes/flight-status-system.git
cd flight-status-system
npm install
```

Create `.env` file:

```
PORT=6969
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
ACCESSTOKENSECRET=your_secret_key
REFRESHTOKENSECRET=your_refresh_secret
```

---

## Running

Development mode:
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs on `http://localhost:6969/api/v1`

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `POST /auth/create-user` - Create user (AOT only)

### Flights
- `POST /flight` - Create flight (ARL/AOT)
- `GET /flight` - List flights with pagination and filters (public)
- `PUT /flight/:id` - Update flight (ARL/AOT)
- `DELETE /flight/:id` - Delete flight (AOT only)

---

## Testing

Quick test with curl:

```bash
# Register
curl -X POST http://localhost:6969/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:6969/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get flights
curl http://localhost:6969/api/v1/flight?page=1&limit=10
```

For detailed testing guide, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## Project Structure

```
src/
├── controllers/     # Business logic
├── routes/         # API routes
├── models/         # Mongoose schemas
├── middlewares/    # Auth, validation, ownership
├── validators/     # Zod validation schemas
└── utils/          # Helper functions
```

---

## Technology Stack

- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- Zod - Validation
- bcrypt - Password hashing
- Prettier - Code formatting

---

## Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Airline-specific ownership enforcement
- Input validation on all endpoints
- Audit trail for all operations
- Environment-based secrets

---

## Documentation

- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Complete API reference with examples
- [PROJECT_COMPLETION.md](PROJECT_COMPLETION.md) - Project status and metrics

---

## Scripts

```bash
npm run dev              # Development with auto-reload
npm start               # Production
npm run format          # Format code with Prettier
npm run format:check    # Check formatting
npm run seed            # Seed admin users
```

---

## Error Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

---

## Troubleshooting

**MongoDB connection error:** Check MONGODB_URI in .env, verify IP whitelist in Atlas

**JWT token expired:** Call POST /auth/refresh to get new token

**CORS error:** Ensure frontend runs on localhost:5173

**Duplicate flight error:** Flight number + departure time must be unique

---

## License

Project is part of Flight Status System

---

**Version:** 1.0.0  
**Created:** April 25, 2026
