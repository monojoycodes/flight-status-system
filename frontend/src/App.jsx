import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import FlightsPage from "./pages/FlightsPage";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["AOT", "ARL"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: "toast-custom",
            style: {
              background: "#111D35",
              color: "#F1F5F9",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              borderRadius: "10px",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
