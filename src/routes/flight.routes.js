import express from "express";

// controllers
import {
  createFlight,
  getFlights,
  updateFlight,
  deleteFlight
} from "../controllers/flight.controller.js";

// middlewares
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkFlightOwnership } from "../middlewares/ownership.middleware.js";

const router = express.Router();


// ✈️ CREATE FLIGHT
// ARL + AOT only
router.post(
  "/",
  verifyToken,
  allowRoles("ARL", "AOT"),
  createFlight
);


// 🌍 GET ALL FLIGHTS (PUBLIC)
router.get("/", getFlights);


// ✏️ UPDATE FLIGHT
// ARL (own only) + AOT (all)
router.put(
  "/:id",
  verifyToken,
  allowRoles("ARL", "AOT"),
  checkFlightOwnership,
  updateFlight
);


// 🗑️ DELETE FLIGHT
// ONLY AOT
router.delete(
  "/:id",
  verifyToken,
  allowRoles("AOT"),
  deleteFlight
);


export default router;