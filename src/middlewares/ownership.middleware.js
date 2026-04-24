import schedule from "../models/schedule.js";

export const checkFlightOwnership = async (req, res, next) => {
  try {
    const flight = await schedule.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        message: "Flight not found"
      });
    }

    // 🟢 AOT → full access
    if (req.user.role === "AOT") {
      req.flight = flight;
      return next();
    }

    // 🟡 ARL → only own airline
    if (req.user.role === "ARL" && req.user.airline === flight.airline) {
      req.flight = flight;
      return next();
    }

    // 🔴 Everyone else blocked
    return res.status(403).json({
      message: "Not authorized to modify this flight"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ownership check failed",
      error: error.message
    });
  }
};
