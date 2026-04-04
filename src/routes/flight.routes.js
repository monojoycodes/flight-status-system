import express from "express";
import { createFlight, getFlights } from "../controllers/flight.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

//create flight (Protected)
router.post("/", 
    verifyToken,
    allowRoles("ARL", "AOT"),
    createFlight
);

//Get flights (access to everyone)
router.get("/", getFlights);

export default router;