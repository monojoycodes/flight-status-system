import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";
import FlightTable from "../components/FlightTable";
import FlightFilters from "../components/FlightFilters";
import Pagination from "../components/Pagination";
import StatsCards from "../components/StatsCards";
import FlightModal from "../components/FlightModal";
import { Plus, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ airline: "", status: "", destination: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [editFlight, setEditFlight] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const fetchAllFlights = useCallback(async () => {
    try {
      const data = await api.getFlights({ page: 1, limit: 100 });
      setAllFlights(data.flights || []);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  useEffect(() => {
    fetchAllFlights();
  }, [fetchAllFlights]);

  const handleCreate = () => {
    setEditFlight(null);
    setModalOpen(true);
  };

  const handleEdit = (flight) => {
    setEditFlight(flight);
    setModalOpen(true);
  };

  const handleDelete = (flight) => {
    setDeleteTarget(flight);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteFlight(deleteTarget._id);
      toast.success(`Flight ${deleteTarget.flightNumber} deleted`);
      setDeleteTarget(null);
      fetchFlights();
      fetchAllFlights();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleSubmit = async (data, id) => {
    if (id) {
      await api.updateFlight(id, data);
      toast.success("Flight updated");
    } else {
      await api.createFlight(data);
      toast.success("Flight created");
    }
    fetchFlights();
    fetchAllFlights();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ airline: "", status: "", destination: "" });
    setPage(1);
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header animate-fade-in">
          <div>
            <h1>
              <LayoutDashboard size={28} className="dashboard-header-icon" />
              Active Flight Management
            </h1>
            <p>
              {user?.role === "AOT"
                ? "Full control over all flights. Create, update, and delete operations."
                : `Managing flights for ${user?.airline || "your airline"}.`}
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus size={18} />
            Create New Flight
          </button>
        </div>

        <StatsCards flights={allFlights} />

        <FlightFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <FlightTable
          flights={flights}
          loading={loading}
          userRole={user?.role}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
        />

        <FlightModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          flight={editFlight}
          userRole={user?.role}
        />

        {deleteTarget && (
          <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="modal-content delete-dialog" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Flight</h3>
              <p>
                Are you sure you want to permanently delete flight{" "}
                <strong>{deleteTarget.flightNumber}</strong>? This action cannot be undone.
              </p>
              <div className="delete-actions">
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete Flight
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
