# 📚 API Documentation — Flight Departure Management System

**Base URL:** `http://localhost:6969/api/v1`

**Version:** 1.0.0

**Last Updated:** April 25, 2026

---

## 📋 Table of Contents

1. [Quick API Reference](#quick-api-reference)
2. [Authentication APIs](#authentication-apis)
3. [Flight APIs](#flight-apis)
4. [Error Codes](#error-codes)
5. [How to Test Each API](#how-to-test-each-api)

---

## 🎯 Quick API Reference

| # | Method | Endpoint | Description | Access | Rules |
|---|--------|----------|-------------|--------|-------|
| **1** | POST | `/auth/register` | Register new user | Public | None |
| **2** | POST | `/auth/login` | Authenticate & get tokens | Public | None |
| **3** | POST | `/auth/refresh` | Get new access token | Public | Uses refreshToken cookie |
| **4** | POST | `/auth/logout` | Logout & clear tokens | Auth | Requires accessToken |
| **5** | POST | `/auth/create-user` | Create user (admin) | AOT Only | Role restriction + Admin only |
| **6** | POST | `/flight` | Create flight | ARL/AOT | Auth required; ARL airline auto-assigned |
| **7** | GET | `/flight` | List flights (paginated) | Public | Pagination (page, limit); Filtering (airline, status, destination) |
| **8** | PUT | `/flight/:id` | Update flight | ARL/AOT | Auth required; ARL can only update own airline flights |
| **9** | DELETE | `/flight/:id` | Delete flight | AOT Only | Auth required; AOT only |

---

## 🔐 Authentication APIs

### 1.1 Register User

**Endpoint:** `POST /auth/register`

**Access:** Public

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 - Success):**
```json
{
  "message": "John Doe has been successfully registered!",
  "detail": {
    "airline": "null",
    "code": "A7K2M"
  }
}
```

**Response (400 - User Exists):**
```json
{
  "message": "John Doe with john@example.com already exists with null airline.",
  "registeredCode": "A7K2M"
}
```

**Validation:**
- `name`: String, minimum 2 characters
- `email`: Valid email format
- `password`: String, minimum 6 characters

---

### 1.2 Login User

**Endpoint:** `POST /auth/login`

**Access:** Public

**Description:** Authenticate user and receive JWT tokens (stored in httpOnly cookies)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 - Success):**
```json
{
  "message": "Login successful"
}
```

**Cookies Set:**
- `accessToken`: JWT token (15 minutes expiry)
- `refreshToken`: JWT token (7 days expiry)

**Response (400 - Invalid Credentials):**
```json
{
  "message": "User not found"
}
```
or
```json
{
  "message": "Invalid password"
}
```

---

### 1.3 Refresh Access Token

**Endpoint:** `POST /auth/refresh`

**Access:** Public (uses refreshToken cookie)

**Description:** Get a new access token using the refresh token

**Request:** No body required (uses refreshToken from cookies)

**Response (200 - Success):**
```json
{
  "message": "Access token refreshed successfully",
  "newAccessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (401 - Invalid Refresh Token):**
```json
{
  "message": "Refresh token is invalid or expired"
}
```

---

### 1.4 Logout User

**Endpoint:** `POST /auth/logout`

**Access:** Authenticated (requires accessToken cookie)

**Description:** Logout user and clear tokens

**Request:** No body required

**Response (200 - Success):**
```json
{
  "message": "John Doe has been logged out. See you soon!",
  "code": "A7K2M"
}
```

**Response (401 - Unauthorized):**
```json
{
  "message": "Unauthorized: No token provided"
}
```

---

### 1.5 Create User (Admin Only)

**Endpoint:** `POST /auth/create-user`

**Access:** AOT role only (Airport Operations Team)

**Description:** Admin creates a new user with specific role

**Request Headers:**
```
Authorization: Bearer <accessToken>
Cookie: accessToken=<token>
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "anotherPassword456",
  "role": "ARL",
  "airline": "IndiGo"
}
```

**Response (201 - Success):**
```json
{
  "message": "Jane Smith has been successfully created!",
  "detail": {
    "code": "B9L4N",
    "role": "ARL",
    "airline": "IndiGo"
  }
}
```

**Response (403 - Forbidden):**
```json
{
  "message": "Forbidden: Only AOT role can perform this action"
}
```

**Valid Roles:** `ARL` (Airline Staff), `AOT` (Airport Operations), `USR` (General User)

---

## ✈️ Flight APIs

### 2.1 Create Flight

**Endpoint:** `POST /flight`

**Access:** ARL (Airline Staff) or AOT (Airport Operations)

**Description:** Create a new flight schedule

**Request Headers:**
```
Authorization: Bearer <accessToken>
Cookie: accessToken=<token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "flightNumber": "AI202",
  "destination": "DEL",
  "departureTime": "2026-04-25T14:30:00Z",
  "gate": 5,
  "airline": "Air India"
}
```

**Response (201 - Success):**
```json
{
  "message": "Flight created successfully",
  "flight": {
    "_id": "507f1f77bcf86cd799439011",
    "flightNumber": "AI202",
    "destination": "DEL",
    "departureTime": "2026-04-25T14:30:00.000Z",
    "gate": 5,
    "airline": "Air India",
    "status": "scheduled",
    "delayMinutes": 0,
    "createdAt": "2026-04-25T10:15:32.000Z",
    "updatedAt": "2026-04-25T10:15:32.000Z"
  }
}
```

**Response (400 - Validation Error):**
```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "flightNumber",
      "message": "Flight number must be 2 letters + 3-4 digits (e.g., AI202)"
    },
    {
      "field": "destination",
      "message": "Destination must be 3-letter IATA code (e.g., DEL, BOM)"
    }
  ]
}
```

**Response (409 - Duplicate Flight):**
```json
{
  "message": "Flight with this number and departure time already exists",
  "duplicate": ["flightNumber", "departureTime"]
}
```

**Business Rules:**
- Flight number: 2 uppercase letters + 3-4 digits (e.g., `AI202`, `AA1234`)
- Destination: 3-letter IATA code (e.g., `DEL`, `BOM`, `DXB`)
- Departure time: Valid ISO 8601 datetime
- Gate: Optional, range 1-200
- If ARL (Airline Staff): Auto-assigns `airline` from user profile
- No duplicate: `flightNumber + departureTime` combination must be unique

---

### 2.2 Get All Flights

**Endpoint:** `GET /flight`

**Access:** Public (no authentication required)

**Description:** Retrieve all flights with pagination and filtering

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1, min: 1) |
| `limit` | number | No | Flights per page (default: 10, min: 1, max: 100) |
| `airline` | string | No | Filter by airline code (max 3 letters, uppercase) |
| `status` | string | No | Filter by status (scheduled, boarding, check-in, delayed, cancelled, security) |
| `destination` | string | No | Filter by destination IATA code (3 letters) |

**Example Request:**
```
GET /flight?page=1&limit=10&airline=AI&status=scheduled&destination=DEL
```

**Response (200 - Success):**
```json
{
  "total": 47,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "flights": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "flightNumber": "AI202",
      "destination": "DEL",
      "departureTime": "2026-04-25T14:30:00.000Z",
      "gate": 5,
      "airline": "Air India",
      "status": "scheduled",
      "delayMinutes": 0,
      "createdAt": "2026-04-25T10:15:32.000Z",
      "updatedAt": "2026-04-25T10:15:32.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "flightNumber": "AA345",
      "destination": "BOM",
      "departureTime": "2026-04-25T15:45:00.000Z",
      "gate": 8,
      "airline": "American Airlines",
      "status": "boarding",
      "delayMinutes": 5,
      "createdAt": "2026-04-25T10:20:15.000Z",
      "updatedAt": "2026-04-25T10:25:00.000Z"
    }
  ]
}
```

**Features:**
- Sorted by `departureTime` (ascending)
- Supports pagination with `total`, `page`, `limit`, `totalPages`
- Dynamic filtering on `airline`, `status`, `destination`
- Case-insensitive airline and destination filtering

---

### 2.3 Update Flight

**Endpoint:** `PUT /flight/:id`

**Access:** AOT (all flights) or ARL (own airline flights only)

**Description:** Update flight details

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Flight MongoDB ObjectId |

**Request Headers:**
```
Authorization: Bearer <accessToken>
Cookie: accessToken=<token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "destination": "BOM",
  "departureTime": "2026-04-25T15:30:00Z",
  "gate": 8,
  "status": "boarding",
  "actualTime": "2026-04-25T14:35:00Z"
}
```

**Response (200 - Success):**
```json
{
  "message": "Flight updated successfully",
  "flight": {
    "_id": "507f1f77bcf86cd799439011",
    "flightNumber": "AI202",
    "destination": "BOM",
    "departureTime": "2026-04-25T15:30:00.000Z",
    "gate": 8,
    "airline": "Air India",
    "status": "boarding",
    "delayMinutes": 0,
    "actualTime": "2026-04-25T14:35:00.000Z",
    "updatedAt": "2026-04-25T10:30:00.000Z"
  }
}
```

**Response (403 - Forbidden for ARL):**
```json
{
  "message": "Forbidden: You can only update flights from your airline"
}
```

**Response (404 - Flight Not Found):**
```json
{
  "message": "Flight not found"
}
```

**Business Rules:**
- ARL can only update flights from their own airline
- AOT can update any flight
- Cannot change `flightNumber` (prevents duplicate key violations)
- All fields optional except implicit airline enforcement

---

### 2.4 Delete Flight

**Endpoint:** `DELETE /flight/:id`

**Access:** AOT only (Airport Operations Team)

**Description:** Delete a flight record

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Flight MongoDB ObjectId |

**Request Headers:**
```
Authorization: Bearer <accessToken>
Cookie: accessToken=<token>
```

**Response (200 - Success):**
```json
{
  "message": "Flight deleted successfully"
}
```

**Response (403 - Forbidden for non-AOT):**
```json
{
  "message": "Forbidden: Only AOT role can delete flights"
}
```

**Response (404 - Flight Not Found):**
```json
{
  "message": "Flight not found"
}
```

**Business Rules:**
- Only AOT can delete flights
- Deletion is permanent and logs audit trail

---

## ❌ Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions for the resource |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource (e.g., duplicate flight) |
| 500 | Internal Server Error | Server-side error |

---

## 🧪 How to Test Each API

### Prerequisites

1. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:6969`

2. **Use Postman or curl** for testing

3. **Ensure MongoDB is connected** (check console for connection logs)

---

### Test 1: Register User

**Using Postman:**
1. Create a new `POST` request
2. URL: `http://localhost:6969/api/v1/auth/register`
3. Body (JSON):
   ```json
   {
     "name": "Alice Johnson",
     "email": "alice@test.com",
     "password": "password123"
   }
   ```
4. Click **Send** → Expected status: **200**

**Using curl:**
```bash
curl -X POST http://localhost:6969/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@test.com",
    "password": "password123"
  }'
```

**Expected Output:**
```json
{
  "message": "Alice Johnson has been successfully registered!",
  "detail": {
    "airline": null,
    "code": "X9Z2L"
  }
}
```

---

### Test 2: Login User

**Using Postman:**
1. Create a new `POST` request
2. URL: `http://localhost:6969/api/v1/auth/login`
3. Body (JSON):
   ```json
   {
     "email": "alice@test.com",
     "password": "password123"
   }
   ```
4. Go to **Cookies** tab → Verify `accessToken` and `refreshToken` are set
5. Click **Send** → Expected status: **200**

**Using curl (with cookies):**
```bash
curl -X POST http://localhost:6969/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "alice@test.com",
    "password": "password123"
  }'
```

**Expected Output:**
```json
{
  "message": "Login successful"
}
```

---

### Test 3: Create Flight (AOT)

**Prerequisite:** Login as AOT user

**Using Postman:**
1. Create a new `POST` request
2. URL: `http://localhost:6969/api/v1/flight`
3. Headers:
   - `Content-Type: application/json`
   - Cookies: Add `accessToken` (from login response)
4. Body (JSON):
   ```json
   {
     "flightNumber": "BA501",
     "destination": "LON",
     "departureTime": "2026-04-25T18:00:00Z",
     "gate": 12,
     "airline": "British Airways"
   }
   ```
5. Click **Send** → Expected status: **201**

**Using curl:**
```bash
curl -X POST http://localhost:6969/api/v1/flight \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "flightNumber": "BA501",
    "destination": "LON",
    "departureTime": "2026-04-25T18:00:00Z",
    "gate": 12,
    "airline": "British Airways"
  }'
```

**Expected Output:**
```json
{
  "message": "Flight created successfully",
  "flight": {
    "_id": "507f191e810c19729de860ea",
    "flightNumber": "BA501",
    "destination": "LON",
    "departureTime": "2026-04-25T18:00:00.000Z",
    "gate": 12,
    "airline": "British Airways",
    "status": "scheduled",
    "delayMinutes": 0
  }
}
```

**Save the `_id`** for upcoming tests

---

### Test 4: Get All Flights (Public)

**Using Postman:**
1. Create a new `GET` request
2. URL: `http://localhost:6969/api/v1/flight?page=1&limit=5&airline=BA`
3. No authentication needed
4. Click **Send** → Expected status: **200**

**Using curl:**
```bash
curl http://localhost:6969/api/v1/flight?page=1&limit=5&airline=BA
```

**Expected Output:**
```json
{
  "total": 1,
  "page": 1,
  "limit": 5,
  "totalPages": 1,
  "flights": [
    {
      "_id": "507f191e810c19729de860ea",
      "flightNumber": "BA501",
      "destination": "LON",
      "airline": "British Airways",
      "status": "scheduled"
    }
  ]
}
```

---

### Test 5: Update Flight

**Prerequisite:** Have flight ID from Test 3

**Using Postman:**
1. Create a new `PUT` request
2. URL: `http://localhost:6969/api/v1/flight/507f191e810c19729de860ea` (replace with actual ID)
3. Headers:
   - `Content-Type: application/json`
   - Cookies: Add `accessToken`
4. Body (JSON):
   ```json
   {
     "status": "boarding",
     "gate": 15
   }
   ```
5. Click **Send** → Expected status: **200**

**Using curl:**
```bash
curl -X PUT http://localhost:6969/api/v1/flight/507f191e810c19729de860ea \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "boarding",
    "gate": 15
  }'
```

**Expected Output:**
```json
{
  "message": "Flight updated successfully",
  "flight": {
    "_id": "507f191e810c19729de860ea",
    "status": "boarding",
    "gate": 15
  }
}
```

---

### Test 6: Delete Flight (AOT Only)

**Prerequisite:** Have flight ID, AOT role

**Using Postman:**
1. Create a new `DELETE` request
2. URL: `http://localhost:6969/api/v1/flight/507f191e810c19729de860ea`
3. Headers:
   - Cookies: Add `accessToken` from AOT user
4. Click **Send** → Expected status: **200**

**Using curl:**
```bash
curl -X DELETE http://localhost:6969/api/v1/flight/507f191e810c19729de860ea \
  -b cookies.txt
```

**Expected Output:**
```json
{
  "message": "Flight deleted successfully"
}
```

---

### Test 7: Duplicate Flight Error

**Using Postman:**
1. Try to create the same flight twice (same `flightNumber` and `departureTime`)
2. Expected status: **409**

**Response:**
```json
{
  "message": "Flight with this number and departure time already exists",
  "duplicate": ["flightNumber", "departureTime"]
}
```

---

### Test 8: Pagination

**Using Postman:**
1. Create `GET` request
2. URL: `http://localhost:6969/api/v1/flight?page=2&limit=5`
3. Click **Send**

**Response includes pagination metadata:**
```json
{
  "total": 47,
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "flights": [...]
}
```

---

### Test 9: Filtering by Status

**Using Postman:**
1. Create `GET` request
2. URL: `http://localhost:6969/api/v1/flight?status=boarding`
3. Click **Send**

**Response includes only boarding flights:**
```json
{
  "flights": [
    {
      "status": "boarding",
      ...
    }
  ]
}
```

---

### Test 10: Unauthorized Access

**Using Postman:**
1. Create `POST` request to `/flight` (create flight)
2. **Do NOT add authentication token**
3. Expected status: **401**

**Response:**
```json
{
  "message": "Unauthorized: No token provided"
}
```

---

### Test 11: Forbidden - ARL Updating Another Airline

**Using Postman:**
1. Login as ARL user from Airline A
2. Try to update flight from Airline B
3. Expected status: **403**

**Response:**
```json
{
  "message": "Forbidden: You can only update flights from your airline"
}
```

---

### Test 12: Audit Trail Verification

**Check MongoDB audit logs:**
```javascript
// In MongoDB shell
db.auditlogs.find({ action: "CREATE", resource: "FLIGHT" }).pretty()
db.auditlogs.find({ action: "UPDATE", resource: "FLIGHT" }).pretty()
db.auditlogs.find({ action: "DELETE", resource: "FLIGHT" }).pretty()
```

**Expected document structure:**
```json
{
  "action": "CREATE",
  "resource": "FLIGHT",
  "userId": ObjectId("..."),
  "userRole": "AOT",
  "resourceId": ObjectId("..."),
  "changes": {
    "before": null,
    "after": {
      "flightNumber": "BA501",
      "destination": "LON"
    }
  },
  "ipAddress": "127.0.0.1",
  "userAgent": "PostmanRuntime/7.x",
  "status": "SUCCESS",
  "createdAt": ISODate("2026-04-25T10:15:32.000Z")
}
```

---

## 📝 Testing Checklist

- [ ] Register user successfully
- [ ] Login and receive tokens in cookies
- [ ] Create flight as AOT (201)
- [ ] Retrieve all flights with pagination (200)
- [ ] Filter flights by airline/status/destination
- [ ] Update flight as AOT (200)
- [ ] Update flight as ARL (own airline only)
- [ ] Attempt ARL update on other airline (403)
- [ ] Delete flight as AOT (200)
- [ ] Attempt delete as non-AOT (403)
- [ ] Create duplicate flight (409)
- [ ] Access without token (401)
- [ ] Verify audit logs in MongoDB

---

**All tests passing?** ✅ Backend is production-ready!
