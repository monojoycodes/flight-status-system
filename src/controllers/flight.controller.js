import { logAudit } from "../utils/auditLog.js";
import Schedule from "../models/schedule.js";

// ✈️ CREATE FLIGHT
export const createFlight = async (req, res) => {
  try {
    let flightData = { ...req.body };

    // enforce airline logic
    if (req.user.role === "ARL") {
      flightData.airline = req.user.airline;
    }

    // safety check
    if (!flightData.airline) {
      return res.status(400).json({
        message: "Airline is required"
      });
    }

    const flight = await Schedule.create(flightData);

    // 📋 Log audit trail
    await logAudit(req, "CREATE", "FLIGHT", flight._id, null, flight.toObject());

    res.status(201).json({
      message: "Flight created successfully",
      flight
    });
  } catch (error) {
    // Check if error is a duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Flight with this number and departure time already exists",
        duplicate: Object.keys(error.keyPattern)
      });
    }
    // For all other errors, return 500
    res.status(500).json({
      message: "Error creating flight",
      error: error.message
    });
  }
};

// 🌍 GET ALL FLIGHTS (with pagination and filters)
export const getFlights = async (req, res) => {
  try {
    let { page = 1, limit = 10, airline, status, destination } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const skip = (page - 1) * limit;

    // 🔥 dynamic filter object
    let filter = {};

    if (airline) {
      filter.airline = airline.toUpperCase();
    }

    if (status) {
      filter.status = status;
    }

    if (destination) {
      filter.destination = destination.toUpperCase();
    }

    // count with filter
    const total = await Schedule.countDocuments(filter);

    const flights = await Schedule.find(filter)
      .sort({ departureTime: 1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      flights
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching flights",
      error: error.message
    });
  }
};

// ✏️ UPDATE FLIGHT
export const updateFlight = async (req, res) => {
  try {
    const flight = req.flight; // from middleware

    // 🔥 Prevent ARL from changing airline
    if (req.user.role === "ARL") {
      req.body.airline = flight.airline;
    }

    const flightBefore = flight.toObject();

    Object.assign(flight, req.body);

    await flight.save();

    // 📋 Log audit trail
    await logAudit(req, "UPDATE", "FLIGHT", flight._id, flightBefore, flight.toObject());

    res.status(200).json({
      message: "Flight updated successfully",
      flight
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating flight",
      error: error.message
    });
  }
};

// 🗑️ DELETE FLIGHT
export const deleteFlight = async (req, res) => {
  try {
    const flight = req.flight;
    const flightBefore = flight.toObject();

    await flight.deleteOne();

    // 📋 Log audit trail
    await logAudit(req, "DELETE", "FLIGHT", flight._id, flightBefore, null);

    res.status(200).json({
      message: "Flight deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting flight",
      error: error.message
    });
  }
};