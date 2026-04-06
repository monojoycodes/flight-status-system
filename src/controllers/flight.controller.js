import schedule from "../models/schedule.js";

//create flight method
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

    res.status(201).json({
      message: "Flight created successfully",
      flight
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating flight",
      error: error.message
    });
  }
};

// 🌍 GET FLIGHTS
export const getFlights = async (req, res) => {
  try {
    const { airline } = req.query;

    let filter = {};

    if (airline) {
      filter.airline = airline.toUpperCase();
    }

    const flights = await Schedule.find(filter)
      .sort({ departureTime: 1 });

    res.status(200).json({
      count: flights.length,
      flights
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching flights",
      error: error.message
    });
  }
};

//update flight
export const updateFlight = async (req, res) => {
  try {
    const flight = req.flight; // from middleware

    // 🔥 Prevent ARL from changing airline
    if (req.user.role === "ARL") {
      req.body.airline = flight.airline;
    }

    Object.assign(flight, req.body);

    await flight.save();

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

export const deleteFlight = async (req, res) => {
  try {
    const flight = req.flight;

    await flight.deleteOne();

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