import express from "express";

// controllers
import {
  createFlight,
  getFlights,
  updateFlight,
  deleteFlight
} from "../controllers/flight.controller.js";

// middlewares
import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { checkFlightOwnership } from "../middlewares/ownership.middleware.js";
import { flightSchema, updateFlightSchema, flightQuerySchema } from "../validators/flight.validator.js";

const router = express.Router();

// ✈️ CREATE FLIGHT
// ARL + AOT only
router.post("/", verifyToken, allowRoles("ARL", "AOT"), validate(flightSchema), createFlight);

// 🌍 GET ALL FLIGHTS (PUBLIC)
router.get("/", validate(flightQuerySchema), getFlights);

// ✏️ UPDATE FLIGHT
// ARL (own only) + AOT (all)
router.put("/:id", verifyToken, allowRoles("ARL", "AOT"), checkFlightOwnership, validate(updateFlightSchema), updateFlight);

// 🗑️ DELETE FLIGHT
// ONLY AOT
router.delete("/:id", verifyToken, allowRoles("AOT"), checkFlightOwnership, deleteFlight);

export default router;
