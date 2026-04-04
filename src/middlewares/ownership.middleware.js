import schedule from "../models/schedule.js";

export const checkFlightOwnership = async (req, res, next) => {
    try {
        const flight = await schedule.findById(req.params.id);

        if (!flight) {
            return res.status(400).json({message: "Flight not found"});
        }

        if (req.user.role === "AOT") {
            req.flight = flight;
            return next();
        }

        if (
            req.user.role === "ARL" && req.user.airline === flight.airline
        ) {
            req.flight = flight;
            return next();
        }

        return res.status(403).json({
            message: "Not allowed to modify this flight"
            });


    } catch (error) {
        res.status(500).json({
            message: "Ownership check failed!",
            error: error.message
        })
    }
}