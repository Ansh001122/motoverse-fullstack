import React, { useEffect, useMemo, useState } from "react";
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
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Vehicle Rental Platform</p>
          <h1>Motoverse</h1>
          <p className="hero-text">
            Book bikes, scooters, cars, and SUVs with a full-stack rental
            workflow built using React and Spring Boot.
          </p>

          <form className="search" onSubmit={handleSearch}>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by vehicle, category, or city"
            />
            <button>Search</button>
          </form>
        </div>

        <div className="hero-card">
          <span>Authentication</span>
          {user ? (
            <>
              <strong>{user.email}</strong>
              <p>Role: {user.role}</p>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <p>Log in to create bookings.</p>
          )}
        </div>
      </section>

      {message && <div className="alert">{message}</div>}

      {!user && (
        <section className="booking-panel">
          <div>
            <p className="eyebrow">JWT Authentication</p>
            <h2>{authMode === "login" ? "Login" : "Create account"}</h2>
            <p>
              {authMode === "login"
                ? "Log in to create and view bookings."
                : "New accounts are created with the USER role."}
            </p>
          </div>

          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              minLength="6"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
              required
            />
            <button>{authMode === "login" ? "Login" : "Register"}</button>
            <button
              type="button"
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
            >
              {authMode === "login" ? "Create account" : "Back to login"}
            </button>
          </form>
        </section>
      )}

      {isAdmin && summary && (
        <section className="stats">
          <Stat label="Total Vehicles" value={summary.totalVehicles} />
          <Stat label="Available" value={summary.availableVehicles} />
          <Stat label="Bookings" value={summary.totalBookings} />
          <Stat label="Revenue" value={`₹${summary.totalRevenue}`} />
        </section>
      )}

      <section className="section-heading">
        <div>
          <p className="eyebrow">Explore Fleet</p>
          <h2>Available rentals</h2>
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>

      <section className="grid">
        {filteredVehicles.map((vehicle) => (
          <article className="vehicle-card" key={vehicle.id}>
            <img src={vehicle.imageUrl} alt={vehicle.name} />

            <div className="vehicle-body">
              <div className="vehicle-title">
                <h3>{vehicle.name}</h3>
                <span className={vehicle.available ? "available" : "unavailable"}>
                  {vehicle.available ? "Available" : "Booked"}
                </span>
              </div>

              <p>
                {vehicle.category} • {vehicle.location}
              </p>

              <strong>₹{vehicle.pricePerDay}/day</strong>

              <button
                disabled={!vehicle.available}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                Book Now
              </button>
            </div>
          </article>
        ))}
      </section>

      {isAuthenticated && (
        <>
          <section className="booking-panel">
            <div>
              <p className="eyebrow">Booking</p>
              <h2>
                {selectedVehicle
                  ? selectedVehicle.name
                  : "Select a vehicle to book"}
              </h2>

              {selectedVehicle && (
                <p>
                  Total estimate: ₹
                  {Number(selectedVehicle.pricePerDay) *
                    Number(form.rentalDays || 1)}
                </p>
              )}
            </div>

            <form onSubmit={handleBooking}>
              <input
                placeholder="Customer name"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                required
              />

              <input
                placeholder="Customer email"
                type="email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
                required
              />

              <input
                placeholder="Rental days"
                type="number"
                min="1"
                value={form.rentalDays}
                onChange={(e) =>
                  setForm({ ...form, rentalDays: e.target.value })
                }
                required
              />

              <button disabled={!selectedVehicle}>Confirm Booking</button>
            </form>
          </section>

          <section className="bookings">
            <p className="eyebrow">Recent Bookings</p>
            <h2>Booking history</h2>

            {bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <div className="booking-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <strong>{booking.vehicle.name}</strong>
                    <span>{booking.customerName}</span>
                    <span>{booking.rentalDays} day(s)</span>
                    <span>₹{booking.totalAmount}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
