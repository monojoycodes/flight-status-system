import { useState, useEffect, useCallback } from "react";
import { api } from "../api/api";
import FlightTable from "../components/FlightTable";
import FlightFilters from "../components/FlightFilters";
import Pagination from "../components/Pagination";
import { Plane, RefreshCw } from "lucide-react";
import "./FlightsPage.css";

const FlightsPage = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ airline: "", status: "", destination: "" });
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (filters.airline) params.airline = filters.airline;
      if (filters.status) params.status = filters.status;
      if (filters.destination) params.destination = filters.destination;
      const data = await api.getFlights(params);
      setFlights(data.flights || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch {
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchFlights, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchFlights]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ airline: "", status: "", destination: "" });
    setPage(1);
  };

  return (
    <div className="flights-page">
      <div className="container">
        <div className="flights-header animate-fade-in">
          <div>
            <h1>
              <Plane size={28} className="flights-header-icon" />
              Public Flights Board
            </h1>
            <p>Real-time departure information for all scheduled flights.</p>
          </div>
          <div className="flights-header-actions">
            <button
              className={`btn btn-sm ${autoRefresh ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw size={14} className={autoRefresh ? "spin" : ""} />
              {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh"}
            </button>
          </div>
        </div>

        <FlightFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <FlightTable
          flights={flights}
          loading={loading}
          userRole={null}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
        />

        <div className="flights-footer-stats animate-fade-in">
          <div className="footer-stat">
            <span className="footer-stat-value">{total}</span>
            <span className="footer-stat-label">Total Departures</span>
          </div>
          <div className="footer-stat">
            <span className="footer-stat-value">
              {flights.filter((f) => f.status === "boarding" || f.status === "check-in").length}
            </span>
            <span className="footer-stat-label">Active Flights</span>
          </div>
          <div className="footer-stat">
            <span className="footer-stat-value">
              {total > 0
                ? `${Math.round(((total - flights.filter((f) => f.status === "delayed").length) / total) * 100)}%`
                : "—"}
            </span>
            <span className="footer-stat-label">On-Time Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightsPage;
