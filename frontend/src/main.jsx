import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createBooking,
  getBookings,
  getDashboardSummary,
  getVehicles,
  login,
  register,
  searchVehicles,
} from "./api";
import "./styles.css";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [form, setForm] = useState({ customerName: "", customerEmail: "", rentalDays: 1 });
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem("motoverse_email");
    const role = localStorage.getItem("motoverse_role");
    return email ? { email, role } : null;
  });
  const [message, setMessage] = useState("");

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "ADMIN";

  async function loadData() {
    const vehicleData = await getVehicles();
    setVehicles(vehicleData);

    if (isAuthenticated) {
      const bookingData = await getBookings();
      setBookings(bookingData);
    } else {
      setBookings([]);
    }

    if (isAdmin) {
      try {
        setSummary(await getDashboardSummary());
      } catch {
        setSummary(null);
      }
    } else {
      setSummary(null);
    }
  }

  useEffect(() => {
    loadData().catch(() =>
      setMessage("Backend is not reachable. Start Spring Boot server first.")
    );
  }, [isAuthenticated, isAdmin]);

  async function handleAuth(e) {
    e.preventDefault();
    try {
      const result =
        authMode === "login"
          ? await login(authForm)
          : await register(authForm);

      localStorage.setItem("motoverse_token", result.token);
      localStorage.setItem("motoverse_email", result.email);
      localStorage.setItem("motoverse_role", result.role);

      setUser({ email: result.email, role: result.role });
      setAuthForm({ email: "", password: "" });
      setMessage(`${authMode === "login" ? "Logged in" : "Registered"} successfully.`);
    } catch (error) {
      setMessage(error.response?.data?.error || "Authentication failed.");
    }
  }

  function logout() {
    localStorage.removeItem("motoverse_token");
    localStorage.removeItem("motoverse_email");
    localStorage.removeItem("motoverse_role");
    setUser(null);
    setMessage("Logged out.");
  }

  async function handleSearch(e) {
    e.preventDefault();
    try {
      setVehicles(await searchVehicles(keyword));
    } catch {
      setMessage("Search failed. Please check backend connection.");
    }
  }

  async function handleBooking(e) {
    e.preventDefault();

    if (!isAuthenticated) {
      setMessage("Please log in before creating a booking.");
      return;
    }

    if (!selectedVehicle) {
      setMessage("Please select a vehicle first.");
      return;
    }

    try {
      await createBooking({
        vehicleId: selectedVehicle.id,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        rentalDays: Number(form.rentalDays),
      });

      setMessage("Booking confirmed successfully.");
      setSelectedVehicle(null);
      setForm({ customerName: "", customerEmail: "", rentalDays: 1 });
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.error || "Booking failed.");
    }
  }

  const categories = useMemo(
    () => ["All", ...new Set(vehicles.map((v) => v.category))],
    [vehicles]
  );

  const filteredVehicles = useMemo(
    () =>
      category === "All"
        ? vehicles
        : vehicles.filter((v) => v.category === category),
    [vehicles, category]
  );

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, color: "#1e293b" }}>🏍️ MotoVerse</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b" }}>Vehicle Rental Platform & Dashboard</p>
        </div>

        <div style={{ padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc" }}>
          {user ? (
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div>
                <strong>{user.email}</strong>
                <span style={{ marginLeft: "8px", fontSize: "0.85rem", background: "#cbd5e1", padding: "2px 6px", borderRadius: "4px" }}>
                  {user.role}
                </span>
              </div>
              <button onClick={logout} style={{ padding: "6px 12px", cursor: "pointer" }}>Logout</button>
            </div>
          ) : (
            <form onSubmit={handleAuth} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                required
                style={{ padding: "6px" }}
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
                style={{ padding: "6px" }}
              />
              <button type="submit" style={{ padding: "6px 12px", cursor: "pointer" }}>
                {authMode === "login" ? "Login" : "Register"}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", textDecoration: "underline" }}
              >
                Switch to {authMode === "login" ? "Register" : "Login"}
              </button>
            </form>
          )}
        </div>
      </header>

      {message && (
        <div style={{ padding: "12px", marginBottom: "1.5rem", background: "#e0f2fe", color: "#0369a1", borderRadius: "6px" }}>
          {message}
        </div>
      )}

      {/* Admin Analytics Panel */}
      {isAdmin && summary && (
        <section style={{ marginBottom: "2rem", padding: "1.5rem", background: "#f1f5f9", borderRadius: "8px" }}>
          <h2>Admin Dashboard Overview</h2>
          <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
            <div style={{ background: "white", padding: "1rem", borderRadius: "6px", flex: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ color: "#64748b" }}>Total Vehicles</div>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.8rem" }}>{summary.totalVehicles || vehicles.length}</h3>
            </div>
            <div style={{ background: "white", padding: "1rem", borderRadius: "6px", flex: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ color: "#64748b" }}>Total Bookings</div>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.8rem" }}>{summary.totalBookings || bookings.length}</h3>
            </div>
            <div style={{ background: "white", padding: "1rem", borderRadius: "6px", flex: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ color: "#64748b" }}>Total Revenue</div>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.8rem", color: "#16a34a" }}>
                ₹{summary.totalRevenue || 0}
              </h3>
            </div>
          </div>
        </section>
      )}

      {/* Search & Category Filter */}
      <section style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", flex: 1 }}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by vehicle name, city, or type..."
            style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />
          <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>Search</button>
        </form>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span>Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section>
        <h2>Available Fleet ({filteredVehicles.length})</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              style={{
                border: selectedVehicle?.id === v.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#ffffff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img
                src={v.imageUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80"}
                alt={v.name}
                style={{ width: "100%", height: "160px", objectFit: "cover" }}
              />
              <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px" }}>{v.name}</h3>
                  <div style={{ color: "#64748b", fontSize: "0.9rem" }}>{v.category} • {v.location}</div>
                  <div style={{ margin: "8px 0", fontWeight: "bold", color: "#0f172a" }}>₹{v.pricePerDay} / day</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedVehicle(v);
                    setForm((prev) => ({
                      ...prev,
                      customerEmail: user?.email || prev.customerEmail,
                    }));
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    cursor: "pointer",
                    background: selectedVehicle?.id === v.id ? "#16a34a" : "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  {selectedVehicle?.id === v.id ? "Selected" : "Book Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form Modal / Section */}
      {selectedVehicle && (
        <section style={{ marginTop: "3rem", padding: "1.5rem", border: "2px solid #2563eb", borderRadius: "8px", background: "#f8fafc" }}>
          <h2>Confirm Booking for {selectedVehicle.name}</h2>
          <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", marginTop: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>Full Name</label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>Email Address</label>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>Rental Duration (Days)</label>
              <input
                type="number"
                min="1"
                value={form.rentalDays}
                onChange={(e) => setForm({ ...form, rentalDays: e.target.value })}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Estimated Total: ₹{(selectedVehicle.pricePerDay * (Number(form.rentalDays) || 1)).toFixed(2)}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" style={{ padding: "8px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Confirm & Pay
              </button>
              <button type="button" onClick={() => setSelectedVehicle(null)} style={{ padding: "8px 16px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Bookings List */}
      {isAuthenticated && bookings.length > 0 && (
        <section style={{ marginTop: "3rem" }}>
          <h2>My Bookings ({bookings.length})</h2>
          <div style={{ marginTop: "1rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #cbd5e1" }}>
                  <th style={{ padding: "8px" }}>Booking ID</th>
                  <th style={{ padding: "8px" }}>Vehicle ID</th>
                  <th style={{ padding: "8px" }}>Days</th>
                  <th style={{ padding: "8px" }}>Total Amount</th>
                  <th style={{ padding: "8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "8px" }}>#{b.id}</td>
                    <td style={{ padding: "8px" }}>{b.vehicleId}</td>
                    <td style={{ padding: "8px" }}>{b.rentalDays}</td>
                    <td style={{ padding: "8px" }}>₹{b.totalAmount}</td>
                    <td style={{ padding: "8px" }}>
                      <span style={{ padding: "2px 6px", borderRadius: "4px", background: "#dcfce7", color: "#15803d" }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);