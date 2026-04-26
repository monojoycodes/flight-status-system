import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./FlightModal.css";

const statusOptions = ["scheduled", "boarding", "check-in", "delayed", "cancelled", "security"];

const FlightModal = ({ isOpen, onClose, onSubmit, flight, userRole }) => {
  const isEdit = Boolean(flight);
  const [form, setForm] = useState({
    flightNumber: "",
    destination: "",
    departureTime: "",
    gate: "",
    airline: "",
    status: "scheduled",
    actualTime: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (flight) {
      setForm({
        flightNumber: flight.flightNumber || "",
        destination: flight.destination || "",
        departureTime: flight.departureTime
          ? new Date(flight.departureTime).toISOString().slice(0, 16)
          : "",
        gate: flight.gate || "",
        airline: flight.airline || "",
        status: flight.status || "scheduled",
        actualTime: flight.actualTime
          ? new Date(flight.actualTime).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setForm({
        flightNumber: "",
        destination: "",
        departureTime: "",
        gate: "",
        airline: "",
        status: "scheduled",
        actualTime: "",
      });
    }
    setErrors({});
  }, [flight, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!isEdit) {
      if (!form.flightNumber.match(/^[A-Z]{2}\d{3,4}$/)) {
        errs.flightNumber = "Must be 2 letters + 3-4 digits (e.g., AI202)";
      }
    }
    if (!form.destination.match(/^[A-Z]{3}$/)) {
      errs.destination = "Must be 3-letter IATA code";
    }
    if (!form.departureTime) {
      errs.departureTime = "Required";
    }
    if (form.gate && (isNaN(form.gate) || form.gate < 1 || form.gate > 200)) {
      errs.gate = "Must be 1-200";
    }
    if (!isEdit && userRole === "AOT" && !form.airline.trim()) {
      errs.airline = "Required for AOT";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = { ...form };
      if (data.gate) data.gate = Number(data.gate);
      else delete data.gate;
      if (data.departureTime) data.departureTime = new Date(data.departureTime).toISOString();
      if (data.actualTime) data.actualTime = new Date(data.actualTime).toISOString();
      else delete data.actualTime;
      if (isEdit) {
        delete data.flightNumber;
        if (userRole !== "AOT") delete data.airline;
      }
      await onSubmit(data, flight?._id);
      onClose();
    } catch (err) {
      setErrors({ _form: err.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "Update Flight" : "Create New Flight"}</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {errors._form && <div className="form-error-bar">{errors._form}</div>}

        <form onSubmit={handleSubmit} className="flight-form">
          {!isEdit && (
            <div className="input-group">
              <label htmlFor="flightNumber">Flight Number</label>
              <input
                id="flightNumber"
                className={`input ${errors.flightNumber ? "input-error" : ""}`}
                placeholder="AI202"
                value={form.flightNumber}
                onChange={(e) => handleChange("flightNumber", e.target.value.toUpperCase())}
              />
              {errors.flightNumber && <span className="field-error">{errors.flightNumber}</span>}
            </div>
          )}

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="destination">Destination (IATA)</label>
              <input
                id="destination"
                className={`input ${errors.destination ? "input-error" : ""}`}
                placeholder="DEL"
                maxLength={3}
                value={form.destination}
                onChange={(e) => handleChange("destination", e.target.value.toUpperCase())}
              />
              {errors.destination && <span className="field-error">{errors.destination}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="gate">Gate</label>
              <input
                id="gate"
                type="number"
                className={`input ${errors.gate ? "input-error" : ""}`}
                placeholder="1-200"
                min={1}
                max={200}
                value={form.gate}
                onChange={(e) => handleChange("gate", e.target.value)}
              />
              {errors.gate && <span className="field-error">{errors.gate}</span>}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="departureTime">Departure Time</label>
            <input
              id="departureTime"
              type="datetime-local"
              className={`input ${errors.departureTime ? "input-error" : ""}`}
              value={form.departureTime}
              onChange={(e) => handleChange("departureTime", e.target.value)}
            />
            {errors.departureTime && <span className="field-error">{errors.departureTime}</span>}
          </div>

          {isEdit && (
            <>
              <div className="input-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  className="input"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="actualTime">Actual Time (optional)</label>
                <input
                  id="actualTime"
                  type="datetime-local"
                  className="input"
                  value={form.actualTime}
                  onChange={(e) => handleChange("actualTime", e.target.value)}
                />
              </div>
            </>
          )}

          {(!isEdit && userRole === "AOT") && (
            <div className="input-group">
              <label htmlFor="airline">Airline</label>
              <input
                id="airline"
                className={`input ${errors.airline ? "input-error" : ""}`}
                placeholder="Air India"
                value={form.airline}
                onChange={(e) => handleChange("airline", e.target.value)}
              />
              {errors.airline && <span className="field-error">{errors.airline}</span>}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Update Flight" : "Create Flight"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightModal;
