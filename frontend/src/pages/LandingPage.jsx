import { Link } from "react-router-dom";
import { Plane, ArrowRight, Shield, Zap, Globe, ChevronRight, BarChart3 } from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">
              <span className="hero-badge-dot" />
              LIVE OPERATIONS
            </div>
            <h1 className="hero-title animate-slide-up stagger-1">
              Live Flight<br />Operations
            </h1>
            <p className="hero-subtitle animate-slide-up stagger-2">
              The ultimate operations hub for modern flight tracking.
              Monitor, manage, and optimize departure data in real time
              with role-based access and powerful analytics.
            </p>
            <div className="hero-actions animate-slide-up stagger-3">
              <Link to="/flights" className="btn btn-primary btn-lg">
                View Flights
                <ArrowRight size={18} />
              </Link>
              <Link to="/auth" className="btn btn-secondary btn-lg">
                Login
              </Link>
            </div>
          </div>

          <div className="hero-visual animate-scale-in stagger-3">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-badge">
                  <Plane size={14} /> IQ-84201
                </div>
                <span className="badge badge-scheduled">Scheduled</span>
              </div>
              <div className="hero-card-route">
                <div className="route-point">
                  <span className="route-code">LHR</span>
                  <span className="route-label">London</span>
                </div>
                <div className="route-line">
                  <Plane size={16} className="route-plane" />
                </div>
                <div className="route-point">
                  <span className="route-code">JFK</span>
                  <span className="route-label">New York</span>
                </div>
              </div>
              <div className="hero-card-details">
                <div className="detail-item">
                  <span className="detail-label">Departure</span>
                  <span className="detail-value">14:30</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gate</span>
                  <span className="detail-value">G12</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value on-time">On Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-glow" />
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container stats-bar-inner">
          <div className="stat-bar-item animate-fade-in stagger-1">
            <BarChart3 size={20} className="stat-bar-icon" />
            <div>
              <span className="stat-bar-value">12.4k</span>
              <span className="stat-bar-label">Flights Tracked</span>
            </div>
          </div>
          <div className="stat-bar-divider" />
          <div className="stat-bar-item animate-fade-in stagger-2">
            <Shield size={20} className="stat-bar-icon" />
            <div>
              <span className="stat-bar-value">99.9%</span>
              <span className="stat-bar-label">System Uptime</span>
            </div>
          </div>
          <div className="stat-bar-divider" />
          <div className="stat-bar-item animate-fade-in stagger-3">
            <Globe size={20} className="stat-bar-icon" />
            <div>
              <span className="stat-bar-value">50+</span>
              <span className="stat-bar-label">Destinations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-header animate-slide-up">
            <h2>Mastering the Skies</h2>
            <p>
              A modern engineering framework to monitor systems in real-time, process flight data, and
              drive operational excellence with full audit control.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card animate-slide-up stagger-1">
              <div className="feature-icon">
                <BarChart3 size={24} />
              </div>
              <h3>Proactive Telemetry</h3>
              <p>
                Track each flight&apos;s departure data in real time, detect delays instantly, and
                get automated delay-minute calculations the moment actual times change.
              </p>
            </div>

            <div className="feature-card animate-slide-up stagger-2">
              <div className="feature-icon teal">
                <Zap size={24} />
              </div>
              <h3>Fast Orchestration</h3>
              <p>
                Create, update, and manage flights at speed with validated inputs, paginated
                browsing, and real-time status filtering across the entire departure board.
              </p>
            </div>

            <div className="feature-card animate-slide-up stagger-3">
              <div className="feature-icon purple">
                <Shield size={24} />
              </div>
              <h3>Secure Infrastructure</h3>
              <p>
                Enterprise-grade role-based access control with JWT auth, airline ownership
                enforcement, comprehensive audit trails, and encrypted credential storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta-inner">
          <h2 className="animate-slide-up">Ready to take control?</h2>
          <p className="animate-slide-up stagger-1">
            Get started in minutes. View the live departure board or log in to manage flights.
          </p>
          <div className="cta-actions animate-slide-up stagger-2">
            <Link to="/auth?mode=register" className="btn btn-primary btn-lg">
              Get Started
              <ChevronRight size={18} />
            </Link>
            <Link to="/flights" className="btn btn-secondary btn-lg">
              View Flights
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <Plane size={18} />
            <span>SkyBoard</span>
          </div>
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} SkyBoard. Flight Departure Management System.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
