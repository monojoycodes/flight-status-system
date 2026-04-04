import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import authRouter from "./src/routes/auth.routes.js"
import cookieParser from "cookie-parser"
import { verifyToken } from "./src/middlewares/auth.middleware.js";
import flightRouter from "./src/routes/flight.routes.js";
import userRouter from "./src/routes/user.routes.js";


dotenv.config()

const app = express()

//middlewares
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res
        .status(200)
       .json({
        message: "One busy human being."
       })
})

app.get("/api/v1/status", (req, res) => {
    res
        .status(200)
        .json({systemStatus: "All Good!"})
})

// let us make a GET request
app.post("/api/v1/data", (req, res) => {
    const data = req.body
    console.log(data)
    res
        .status(200)
        .json(
            {
                message: "Data Received!",
                data: data
            }
        )
})

//login, register both work with just this line below:
app.use("/api/v1/auth", authRouter);

//error handler middleware - MUST be last
app.use((err, req, res, next) => {
    console.log(err.stack)
    res
        .status(500)
        .json({
            message: "Server side error has occured!",
            error: err.message
        })
})

// 🔐 TEST PROTECTED ROUTE
app.get("/api/v1/me", verifyToken, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    user: req.user
  });
});

app.use("/api/v1/flight", flightRouter);
app.use("/api/v1/users", userRouter);

export default app