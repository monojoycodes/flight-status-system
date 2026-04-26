import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Plane, Menu, X, LogOut, LayoutDashboard, Globe } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const roleBadgeClass = user
    ? `badge badge-role badge-role-${user.role?.toLowerCase()}`
    : "";

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <div className="brand-icon">
            <Plane size={20} />
          </div>
          <span className="brand-text">SkyBoard</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? "open" : ""}`}>
          <Link
            to="/flights"
            className={`nav-link ${isActive("/flights") ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            <Globe size={16} />
            Flights
          </Link>

          {user && (user.role === "AOT" || user.role === "ARL") && (
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          )}

          <div className="nav-divider" />

          {user ? (
            <div className="nav-user">
              <div className="nav-user-info">
                <span className="nav-user-name">{user.name || user.code}</span>
                <span className={roleBadgeClass}>{user.role}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link
                to="/auth"
                className="btn btn-secondary btn-sm"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/auth?mode=register"
                className="btn btn-primary btn-sm"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
