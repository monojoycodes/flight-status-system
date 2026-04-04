# 📄 PRD — Flight Departure Management System (Backend)

---

# 🧠 1. Objective

Build a **secure backend system** to:

* Manage flight departure schedules
* Enforce **role-based access (RBAC)**
* Support **airline-specific ownership control**
* Provide data to display systems (read-only users)

---

# 👥 2. User Roles

## 1. Airline Staff (`ARL`)

* Can:

  * Create flights (ONLY their airline)
  * Update their own flights
* Cannot:

  * Modify other airline data

---

## 2. Airport Operations Team (`AOT`)

* Full control:

  * Create, update, delete ANY flight
  * Create users (admin role)

---

## 3. General / Display (`USR`)

* Read-only access
* Used for:

  * airport screens
  * public APIs

---

# 🔐 3. Authentication & Authorization

## ✅ Already implemented:

* Register
* Login
* JWT tokens
* Cookies

---

## 🚀 To implement next:

### 3.1 Auth Middleware

* Extract token from cookies
* Verify JWT
* Attach `req.user`

---

### 3.2 Role Middleware

* Restrict access based on:

```text
role → ARL / AOT / USR
```

---

### 3.3 Ownership Logic (CRITICAL)

```text
IF role = ARL
→ allow ONLY if req.user.airline === flight.airline
```

---

# ✈️ 4. Flight Module (Core System)

## 📁 Model: `Schedule`

Already exists.

---

## 🚀 APIs to build

---

## 4.1 Create Flight

```http
POST /api/v1/flights
```

### Access:

* ARL ✅ (own airline only)
* AOT ✅

### Logic:

* If ARL:

  ```js
  req.body.airline = req.user.airline;
  ```

---

## 4.2 Get Flights

```http
GET /api/v1/flights
```

### Access:

* Public ✅

### Features:

* Sorting by departure time
* Filtering:

  ```http
  ?airline=INDIGO
  ```

---

## 4.3 Update Flight

```http
PUT /api/v1/flights/:id
```

### Access:

* AOT ✅
* ARL ✅ (ONLY own flights)

### Logic:

* Ownership check

---

## 4.4 Delete Flight

```http
DELETE /api/v1/flights/:id
```

### Access:

* AOT ONLY ✅

---

# 🛡️ 5. Security Requirements

## MUST:

* Password hashing (already done)
* Token validation (middleware)
* Role restriction
* Ownership enforcement

---

## SHOULD:

* Store refresh tokens securely
* Use environment variables for secrets

---

# 🧩 6. Data Integrity Rules

* Flight must belong to ONE airline
* No duplicate:

```text
flightNumber + departureTime
```

* Status must be enum:

```text
scheduled, boarding, delayed, cancelled
```

---

# 📦 7. System Architecture

```text
Client
  ↓
Routes
  ↓
Middleware (auth + role)
  ↓
Controller
  ↓
Model (MongoDB)
```

---

# 🧪 8. Testing Plan

## Must test:

### Auth:

* Register
* Login
* Invalid login
* Token expiry

---

### Flights:

* Create (ARL vs AOT)
* Update (own vs other airline)
* Delete (restricted)
* Get (public)

---

# ⚠️ 9. Edge Cases

* ARL tries to edit other airline → ❌
* No token → ❌
* Invalid token → ❌
* Duplicate flight → ❌
* Missing required fields → ❌

---

# 🚀 10. Milestones (Execution Plan)

## Phase 1 (Immediate)

* ✅ Auth middleware
* ✅ Role middleware
* ✅ Protect one route

---

## Phase 2

* Flight CRUD APIs
* Ownership logic

---

## Phase 3

* Filtering + sorting
* Better validation

---

## Phase 4 (Optional Advanced)

* Refresh token flow
* Audit logs (who updated what)
* Real-time updates (WebSocket)

---

# ⚡ Final takeaway

You’re moving from:

```text
"learning Express"
```

to:

```text
"building a real backend system"
```

---

# 👉 What YOU should do next (no overthinking)

Start coding:

### 1.

👉 `verifyToken` middleware

### 2.

👉 protect `/api/v1/data`

### 3.

👉 build `/api/v1/flights` (POST first)

