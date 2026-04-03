import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import authRouter from "./src/routes/auth.routes.js"

dotenv.config()

const app = express()

//middlewares
app.use(cors())
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

export default app