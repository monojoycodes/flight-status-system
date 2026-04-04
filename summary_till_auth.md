# Flight Tracking API - Summary (Till Auth Implementation)

## Project Overview
A **MERN Stack Application** designed for flight tracking and management. The backend is fully functional with authentication. This API allows users, airlines, and airport terminals to interact with flight scheduling and booking data.

## Tech Stack
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access & Refresh Tokens)
- **Security:** bcrypt for password hashing
- **Utilities:** CORS, Body Parser, dotenv for environment management

## Database Models

### 1. **User Model** (`users.js`)
Manages user accounts with role-based access control.

**Fields:**
- `name` - User's full name
- `email` - Unique email identifier
- `password` - Hashed password (bcrypt)
- `airline` - Airline code (optional, 2-3 character code)
- `role` - User role: 
  - `ARL` = Airline Staff
  - `AOT` = Airport Terminal Operator
  - `USR` = Regular User (default)
- `code` - Unique 5-character alphanumeric identifier
- `refreshToken` - Stored refresh token for session management

**Methods:**
- `generateAccessToken()` - Creates short-lived JWT (15 min default)
- `generateRefreshToken()` - Creates long-lived JWT (7 days default)
- `generateTokens()` - Returns both tokens
- `isPasswordCorrect()` - Validates password during login

---

### 2. **Schedule Model** (`schedule.js`)
Tracks flight information and status.

**Fields:**
- `airline` - Airline name/code
- `flightNumber` - Unique flight identifier
- `origin` - Departure airport (default: "NAGPUR")
- `destination` - Arrival airport
- `departureTime` - Scheduled departure
- `actualTime` - Actual departure time
- `delayMinutes` - Calculated delay
- `gate` - Airport gate number
- `status` - Flight status (scheduled, boarding, check-in, delayed, cancelled, security)
- `timestamps` - Auto-generated createdAt & updatedAt

**Indexes:**
- `departureTime` (ascending) - Fast retrieval by time
- `flightNumber + departureTime` (unique) - Prevents duplicate flights

---

## API Endpoints

### Base URL
```
http://localhost:7000/api/v1
```

### Authentication Routes (`/auth`)

#### 1. Register User
```
POST /api/v1/auth/register
Content-Type: application/json

Body:
{
  "name": "John Pilot",
  "email": "john@airline.com",
  "password": "securePassword123",
  "airline": "AA",
  "role": "ARL"  // optional, defaults to "USR"
}

Response (201):
{
  "message": "John Pilot has been successfully registered!",
  "detail": {
    "airline": "AA",
    "code": "X7K2M"
  }
}
```

#### 2. Login User
```
POST /api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "john@airline.com",
  "password": "securePassword123"
}

Response (200):
{
  "message": "Login successful"
}

Cookies Set:
- accessToken (15 min expiry, httpOnly)
- refreshToken (7 days expiry, httpOnly)
```

### Health Check Routes

#### System Status
```
GET /api/v1/status
Response: { "systemStatus": "All Good!" }
```

#### Root Endpoint
```
GET /
Response: { "message": "One busy human being." }
```

#### Test Data Endpoint
```
POST /api/v1/data
Body: { any valid JSON data }
Response: { "message": "Data Received!", "data": {...} }
```

---

## Architecture

```
DB_MERN/
├── index.js                 # Entry point - MongoDB connection & server startup
├── app.js                   # Express app configuration & middleware setup
├── package.json             # Dependencies & scripts
├── src/
│   ├── controllers/
│   │   └── auth.controller.js    # Login & Register logic
│   ├── models/
│   │   ├── users.js              # User schema & JWT methods
│   │   └── schedule.js           # Flight schedule schema
│   ├── routes/
│   │   └── auth.routes.js        # Auth endpoints routing
│   ├── middlewares/         # (To be implemented)
│   ├── validators/          # (To be implemented)
│   ├── utils/               # (To be implemented)
│   └── dB/                  # (To be implemented)
```

---

## Current Features
✅ User registration with role-based access  
✅ Secure login with JWT tokens (access + refresh)  
✅ Password hashing with bcrypt  
✅ Cookie-based token storage  
✅ Flight schedule data structure  
✅ Unique flight identification (flightNumber + departureTime)  
✅ Flight status tracking  

---

## Next Steps (To Be Built)
- [ ] Middleware for JWT verification (auth middleware)
- [ ] Validators for request data validation
- [ ] Flight CRUD operations (Create, Read, Update, Delete)
- [ ] Flight search & filtering by date, airline, route
- [ ] Delay calculation & notification system
- [ ] Role-based endpoints (airline vs user permissions)
- [ ] Refresh token endpoint
- [ ] Logout functionality
- [ ] Error handling improvements
- [ ] Frontend (React) implementation

---

## Environment Variables Required
```
PORT=7000
MONGODB_URI=mongodb://...
ACCESSTOKENSECRET=your_secret_key
ACCESSTOKENEXPIRY=15m
REFRESHTOKENSECRET=your_refresh_secret
REFRESHTOKENEXPIRY=7d
```

---

## Running the Project
```bash
npm install              # Install dependencies
npm run dev             # Start with nodemon (development)
npm start               # Start production server
```

