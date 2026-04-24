# ✈️ Flight Departure Management System — Backend

A production-ready **Node.js + Express + MongoDB** backend for managing airport flight schedules with role-based access control, comprehensive audit logging, and secure JWT authentication.

**Status:** ✅ **Production Ready**  
**Last Updated:** April 25, 2026

---

## 🎯 Quick Overview

This backend provides a **secure, scalable REST API** for:
- 🔐 User authentication & authorization (JWT + roles)
- ✈️ Flight schedule management (CRUD operations)
- 🛡️ Role-based access control (ARL, AOT, USR)
- 📋 Audit trail for compliance & debugging
- 📊 Pagination & filtering for large datasets
- ✅ Input validation & error handling

---

## ✨ Key Features

### 🔐 Security
- ✅ JWT token-based authentication with httpOnly cookies
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Airline-specific ownership enforcement
- ✅ Refresh token mechanism for long sessions
- ✅ Environment-based secrets management

### ✈️ Flight Management
- ✅ Create, read, update, delete flight schedules
- ✅ Pagination support (page, limit)
- ✅ Multi-field filtering (airline, status, destination)
- ✅ Unique flight constraints (flightNumber + departureTime)
- ✅ Duplicate key error handling
- ✅ Automatic delay calculation

### 👥 User Management
- ✅ User registration with validation
- ✅ Admin user creation by AOT role
- ✅ Three role types: ARL (Airline), AOT (Airport Ops), USR (Display)
- ✅ Secure token storage

### 📋 Audit & Compliance
- ✅ Complete audit trail (CREATE/UPDATE/DELETE)
- ✅ Before/after data snapshots
- ✅ User context capture (userId, role, IP, userAgent)
- ✅ Timestamp tracking for all actions

### 📚 API & Documentation
- ✅ 9 fully-documented REST endpoints
- ✅ Comprehensive API documentation with examples
- ✅ Testing guide with curl & Postman examples
- ✅ Error code reference

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- **MongoDB Atlas** account (free tier) ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git** (optional, for cloning)

### 1️⃣ Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd DB_MERN

# Install dependencies
npm install
```

### 2️⃣ Setup Environment

Create a `.env` file in the root directory:

```env
# Server
PORT=6969

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Secrets
ACCESSTOKENSECRET=your_super_secret_access_key_min_32_chars_long
REFRESHTOKENSECRET=your_super_secret_refresh_key_min_32_chars_long
```

**How to get MONGODB_URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Click "Connect" → "Drivers" → Copy connection string
4. Replace `<password>` and `<username>` in the string

### 3️⃣ Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
Server running on port 6969
MongoDB connected successfully
```

✅ **Server is now running!** API available at `http://localhost:6969/api/v1`

---

## 📚 API Endpoints

### Authentication (5 endpoints)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login & get tokens | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout user | Auth |
| POST | `/auth/create-user` | Create user (admin) | AOT |

### Flight Management (4 endpoints)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/flight` | Create flight | ARL/AOT |
| GET | `/flight` | List flights | Public |
| PUT | `/flight/:id` | Update flight | ARL/AOT |
| DELETE | `/flight/:id` | Delete flight | AOT |

**Full API docs:** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🧪 Testing APIs

### Option 1: Using curl (Command Line)

**Register user:**
```bash
curl -X POST http://localhost:6969/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:6969/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get flights:**
```bash
curl http://localhost:6969/api/v1/flight?page=1&limit=10
```

### Option 2: Using Postman (GUI)

1. [Download Postman](https://www.postman.com/downloads/)
2. Import environment variables for `baseUrl = http://localhost:6969/api/v1`
3. Use examples from [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. Cookies are automatically managed

**Detailed testing guide:** See [API_DOCUMENTATION.md#how-to-test-each-api](API_DOCUMENTATION.md#how-to-test-each-api)

---

## 📁 Project Structure

```
DB_MERN/
├── app.js                      # Express app configuration
├── index.js                    # Server entry point & DB connection
├── package.json                # Dependencies & scripts
├── .env                        # Environment variables (create this)
│
├── src/
│   ├── controllers/            # Business logic
│   │   ├── auth.controller.js
│   │   └── flight.controller.js
│   │
│   ├── routes/                 # API endpoints
│   │   ├── auth.routes.js
│   │   └── flight.routes.js
│   │
│   ├── models/                 # Mongoose schemas
│   │   ├── users.js
│   │   ├── schedule.js (Flight schema)
│   │   └── auditLog.js
│   │
│   ├── middlewares/            # Request processing
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── ownership.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── validators/             # Zod validation schemas
│   │   ├── auth.validator.js
│   │   └── flight.validator.js
│   │
│   └── utils/                  # Helper functions
│       └── auditLog.js
│
├── API_DOCUMENTATION.md        # Complete API reference
├── PROJECT_COMPLETION.md       # Project status & metrics
└── readme.md                   # This file
```

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js v18+ | JavaScript runtime |
| **Framework** | Express.js | Web server framework |
| **Database** | MongoDB Atlas | Cloud document database |
| **ORM** | Mongoose v7+ | MongoDB object modeling |
| **Validation** | Zod v3+ | TypeScript-first schema validation |
| **Authentication** | JWT | Token-based auth |
| **Password Hash** | bcrypt | Secure password hashing |
| **Code Format** | Prettier | Code formatter |
| **Env Config** | dotenv | Environment variables |

---

## 🔐 Security Features

### Authentication
- ✅ JWT tokens (15 min access, 7 day refresh)
- ✅ httpOnly cookies (XSS protection)
- ✅ Secure token validation in middleware
- ✅ Hashed refresh tokens in database

### Authorization
- ✅ Role-based access control (ARL, AOT, USR)
- ✅ Airline-specific ownership checks
- ✅ Middleware-enforced permissions

### Data Protection
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Environment secrets via .env
- ✅ MongoDB unique indexes
- ✅ Input validation with Zod schemas

### Audit Trail
- ✅ All modifications logged
- ✅ User context preserved
- ✅ IP address & user agent tracked
- ✅ Before/after data snapshots

---

## 📋 npm Scripts

```bash
# Development (auto-reload on file changes)
npm run dev

# Production
npm start

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Seed admin users (optional)
npm run seed
```

---

## 🧪 Test Checklist

- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] Register new user → Status 200
- [ ] Login → Receive accessToken & refreshToken
- [ ] Create flight → Status 201
- [ ] Get flights → Returns paginated list
- [ ] Update flight → Status 200
- [ ] Delete flight → Status 200 (AOT only)
- [ ] Audit logs appear in MongoDB
- [ ] All error codes working (400, 401, 403, 404, 409, 500)

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error:** `querySrv ECONNREFUSED` or `MongoNetworkError`

**Solution:**
1. Verify MONGODB_URI in `.env` is correct
2. Check IP whitelist in MongoDB Atlas (0.0.0.0/0 for dev)
3. Ensure internet connection is working
4. Try DNS fallback: Server uses 8.8.8.8 & 1.1.1.1 automatically

### JWT Token Expired
**Error:** `401 Unauthorized: Token expired`

**Solution:**
1. Call `POST /auth/refresh` to get new access token
2. Or login again with `POST /auth/login`

### CORS Error (Frontend to Backend)
**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
1. Ensure frontend runs on `localhost:5173` (default Vite port)
2. Backend CORS config allows this origin
3. Include `credentials: true` in fetch/axios

### "Airline is required" Error
**Error:** `400 Bad Request: Airline is required`

**Solution:**
- If role is AOT: Pass `airline` in request body
- If role is ARL: Airline auto-assigned from user profile

### Duplicate Flight Error
**Error:** `409 Conflict: Flight with this number and departure time already exists`

**Solution:**
- Flight numbers must be unique per departure time
- Either use different flightNumber or departureTime
- Or delete the existing flight first

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Complete API reference with examples & testing guide |
| **[PROJECT_COMPLETION.md](PROJECT_COMPLETION.md)** | Project status, metrics, and completion checklist |
| **[prd.md](prd.md)** | Original product requirements (all implemented) |
| **readme.md** | This file — setup & quick start |

---

## 🎯 Next Steps

### For Testing
1. ✅ Start server with `npm run dev`
2. ✅ Test all APIs using curl or Postman
3. ✅ Follow [API_DOCUMENTATION.md testing guide](API_DOCUMENTATION.md#how-to-test-each-api)

### For Frontend Integration
1. Create React app with Vite
2. Install Stitch UI components
3. Call backend APIs from React components
4. Display flights, create/edit forms with role-based UI
5. See frontend starter template (coming soon)

### For Production Deployment
1. Set `NODE_ENV=production`
2. Use production MongoDB cluster
3. Generate strong secrets for JWT keys
4. Enable HTTPS (SSL certificate)
5. Deploy to cloud (Heroku, Railway, Render, etc.)
6. Monitor logs and audit trails

---

## 🤝 Support

### Common Questions

**Q: Can ARL users delete flights?**  
A: No, only AOT can delete. ARL can create/update their own airline's flights.

**Q: How long do tokens last?**  
A: Access token = 15 minutes, Refresh token = 7 days.

**Q: Can I modify another airline's flight?**  
A: Not if you're ARL. AOT can modify any flight.

**Q: Is the API production-ready?**  
A: Yes! All security features, validation, error handling, and audit logging are implemented.

**Q: How do I add a new API endpoint?**  
A: Follow the pattern: Create controller → Create route → Add validator → Mount in app.js

---

## 📊 Performance & Limits

| Metric | Value |
|--------|-------|
| **Pagination Limit** | 1-100 flights per page |
| **Default Page Size** | 10 flights |
| **Token Expiry** | 15 min (access), 7 days (refresh) |
| **Password Min Length** | 6 characters |
| **Flight Number Format** | 2 letters + 3-4 digits |
| **Gate Range** | 1-200 |
| **Destination** | 3-letter IATA code |

---

## 📄 License

This project is part of the Flight Departure Management System.

---

## ✅ Project Status

```
🚀 Production Ready
✅ All PRD requirements met
✅ Security hardened
✅ API fully documented
✅ Ready for frontend integration
✅ Ready for deployment
```

---

## 👨‍💻 Developer Info

**Created:** April 25, 2026  
**Version:** 1.0.0  
**Node Version:** 18+  
**npm Version:** 9+  

---

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Auth](https://jwt.io/)
- [Zod Validation](https://zod.dev/)

---

**Questions?** Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) or [PROJECT_COMPLETION.md](PROJECT_COMPLETION.md)

**Ready to start?** Run `npm run dev` and test the APIs! 🚀
