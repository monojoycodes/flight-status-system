import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import statusMonitor from "express-status-monitor";

import { verifyToken } from "./src/middlewares/auth.middleware.js";
import flightRouter from "./src/routes/flight.routes.js";
import userRouter from "./src/routes/user.routes.js";

dotenv.config();

const app = express();

// Production / Monitoring Middlewares
app.use(statusMonitor());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

//middlewares
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // Will be defined if they provide it
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.includes("vercel.app") || origin.includes("onrender.com")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "One busy human being."
  });
});

app.get("/api/v1/status", (req, res) => {
  res.status(200).json({ systemStatus: "All Good!" });
});

// let us make a GET request
app.post("/api/v1/data", (req, res) => {
  const data = req.body;
  console.log(data);
  res.status(200).json({
    message: "Data Received!",
    data: data
  });
});

//login, register both work with just this line below:
app.use("/api/v1/auth", authRouter);

// 🔐 TEST PROTECTED ROUTE
app.get("/api/v1/me", verifyToken, (req, res) => {
  const { id, code, name, airline, role } = req.user;
  res.status(200).json({
  message: `Welcome, ${name}. You are authenticated.`,
    user: { code, airline, role }
  });
});

app.use("/api/v1/flight", flightRouter);
app.use("/api/v1/users", userRouter);

//error handler middleware - MUST be last
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    message: "Server side error has occured!",
    error: err.message
  });
});

export default app;
