import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    airline: {
            type: String,
            uppercase: true,
            required: true,
            trim: true
        },

        flightNumber: {
            type: String,
            required: true
        },

        origin: {
            type: String,
            uppercase: true,
            required: true,
            default: "NAGPUR"
        },

        destination: {
            type: String,
            uppercase: true,
            required: true,
            trim: true
        },

        departureTime: {
            type: Date,
            required: true
        },

        actualTime: {
            type: Date,
            default: null
        },

        delayMinutes: {
            type: Number,
            default: 0,
            min: 0
        }, 

        gate: {
            type: Number
        },

        status: {
            type: String,
            enum: [
                "scheduled", "boarding", "check-in", "delayed", "cancelled", "security"
            ],
            default: "scheduled",
            required: true
        }
}, { timestamps: true });

scheduleSchema.index({departureTime: 1}); //store docs in sorted order as per dept. time (1- ascen, 2- decen)

scheduleSchema.index(
  { flightNumber: 1, departureTime: 1 },
  { unique: true }
);

scheduleSchema.pre("save", function(next) {
  if (this.actualDeparture && this.departureTime) {
    const delay =
      (this.actualDeparture - this.departureTime) / (1000 * 60);

    this.delayMinutes = Math.max(0, Math.round(delay));
  }

  next();
});

scheduleSchema.post("save", function(doc) {
  console.log("Flight saved:", doc.flightNumber);
});

export default mongoose.model("Schedule", scheduleSchema);
//import Schedule from ""