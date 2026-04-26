import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Plane, Eye, EyeOff, Shield, BarChart3, Clock } from "lucide-react";
import toast from "react-hot-toast";
import "./AuthPage.css";

const AuthPage = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("mode") === "register" ? "register" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleChange = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        await register(form.name, form.email, form.password);
        toast.success("Registration successful! Please login.");
        setMode("login");
        setForm((p) => ({ ...p, password: "" }));
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="auth-panel-content">
          <div className="auth-branding">
            <div className="auth-logo">
              <Plane size={24} />
            </div>
            <span>SkyBoard</span>
          </div>

          <h2 className="auth-panel-title">
            Secure Operations<br />for the Modern<br />Airspace.
          </h2>

          <p className="auth-panel-desc">
            Manage flight departures with role-based precision. From airline staff
            to airport operations — every action is authenticated, authorized, and audited.
          </p>

          <div className="auth-panel-stats">
            <div className="auth-stat">
              <BarChart3 size={18} />
              <div>
                <span className="auth-stat-value">12.4k</span>
                <span className="auth-stat-label">Flights</span>
              </div>
            </div>
            <div className="auth-stat">
              <Clock size={18} />
              <div>
                <span className="auth-stat-value">99.9%</span>
                <span className="auth-stat-label">Uptime</span>
              </div>
            </div>
            <div className="auth-stat">
              <Shield size={18} />
              <div>
                <span className="auth-stat-value">256-bit</span>
                <span className="auth-stat-label">Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-left-glow" />
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-container">
          <h2 className="auth-form-title animate-fade-in">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="auth-form-desc animate-fade-in">
            {mode === "login"
              ? "Sign in to access your flight management dashboard."
              : "Register to get started with SkyBoard."}
          </p>

          <form className="auth-form animate-slide-up" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="input-group">
                <label htmlFor="auth-name">Full Name</label>
                <input
                  id="auth-name"
                  className="input"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  minLength={2}
                />
              </div>
            )}

            <div className="input-group">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="auth-password">Password</label>
              <div className="password-wrapper">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <p className="auth-switch animate-fade-in">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button className="auth-switch-btn" onClick={switchMode}>
              {mode === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
