import { Pencil, Trash2, Clock, Plane } from "lucide-react";
import "./FlightTable.css";

const statusConfig = {
  scheduled: "badge-scheduled",
  boarding: "badge-boarding",
  "check-in": "badge-check-in",
  delayed: "badge-delayed",
  cancelled: "badge-cancelled",
  security: "badge-security",
};

const formatTime = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const FlightTable = ({ flights, loading, userRole, onEdit, onDelete }) => {
  const canEdit = userRole === "AOT" || userRole === "ARL";
  const canDelete = userRole === "AOT";

  if (loading) {
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Flight</th><th>Airline</th><th>Route</th>
              <th>Departure</th><th>Gate</th><th>Status</th><th>Delay</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: canEdit ? 8 : 7 }).map((_, j) => (
                  <td key={j}><div className="skeleton" style={{ height: 18, width: "80%" }} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="table-empty">
        <Plane size={48} />
        <h3>No flights found</h3>
        <p>Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Flight</th>
            <th>Airline</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Gate</th>
            <th>Status</th>
            <th>Delay</th>
            {canEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, idx) => (
            <tr key={flight._id} className="animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
              <td>
                <span className="flight-number">{flight.flightNumber}</span>
              </td>
              <td>{flight.airline}</td>
              <td>
                <span className="route-cell">
                  <span className="route-origin">{flight.origin || "NAG"}</span>
                  <span className="route-arrow">→</span>
                  <span className="route-dest">{flight.destination}</span>
                </span>
              </td>
              <td>
                <div className="departure-cell">
                  <span className="departure-time">{formatTime(flight.departureTime)}</span>
                  <span className="departure-date">{formatDate(flight.departureTime)}</span>
                </div>
              </td>
              <td>
                {flight.gate ? (
                  <span className="gate-badge">G{flight.gate}</span>
                ) : (
                  <span className="gate-tbd">TBD</span>
                )}
              </td>
              <td>
                <span className={`badge ${statusConfig[flight.status] || "badge-scheduled"}`}>
                  {flight.status}
                </span>
              </td>
              <td>
                {flight.delayMinutes > 0 ? (
                  <span className="delay-value">
                    <Clock size={13} />
                    {flight.delayMinutes}m
                  </span>
                ) : (
                  <span className="on-time">On time</span>
                )}
              </td>
              {canEdit && (
                <td>
                  <div className="action-btns">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(flight)}
                      title="Edit flight"
                    >
                      <Pencil size={14} />
                    </button>
                    {canDelete && (
                      <button
                        className="action-btn delete"
                        onClick={() => onDelete(flight)}
                        title="Delete flight"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;
