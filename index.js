import app from "./app.js"
import mongoose from "mongoose"

const PORT = process.env.PORT || 7000
const MONGODB_URI = process.env.MONGODB_URI

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("✅ Connected to Mongo DB!")
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/ .`)
        })
    })
    .catch((err) => {
        console.log("FAILED: MongoDB connection failed!")
        process.exit(1);
    })