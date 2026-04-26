import { Search, RotateCcw } from "lucide-react";
import "./FlightFilters.css";

const statuses = ["scheduled", "boarding", "check-in", "delayed", "cancelled", "security"];

const FlightFilters = ({ filters, onChange, onReset }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flight-filters">
      <div className="filter-group">
        <div className="filter-search">
          <Search size={16} className="filter-search-icon" />
          <input
            type="text"
            className="input filter-input"
            placeholder="Filter by airline..."
            value={filters.airline || ""}
            onChange={(e) => handleChange("airline", e.target.value)}
          />
        </div>

        <select
          className="input filter-select"
          value={filters.status || ""}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="input filter-input-sm"
          placeholder="Destination (IATA)"
          maxLength={3}
          value={filters.destination || ""}
          onChange={(e) => handleChange("destination", e.target.value.toUpperCase())}
        />
      </div>

      <button className="btn btn-ghost btn-sm" onClick={onReset}>
        <RotateCcw size={14} />
        Reset
      </button>
    </div>
  );
};

export default FlightFilters;
