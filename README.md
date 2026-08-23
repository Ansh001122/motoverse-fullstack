# MotoVerse — Vehicle Rental Platform

MotoVerse is a full-stack vehicle rental platform built with React and Spring Boot. Users can browse vehicles, search by vehicle details, check availability, create bookings, and view rental statistics.

The backend uses a layered Controller → Service → Repository architecture with Spring Data JPA and MySQL for persistence. It includes stateless JWT authentication, role-based access control, Docker support, and a transactional booking-payment lifecycle.

---

### Features

* **Fleet Catalog & Real-Time Search:** Browse and search vehicles across categories (Adventure, Cruiser, Naked, Scooter, Sport, Tourer) and regional hubs.
* **Server-Side Price Calculation:** Prevents client-side price tampering by computing rental totals strictly on the server:
  $$\text{Total Amount} = \text{Price Per Day} \times \text{Rental Days}$$
* **Transactional Booking & Payment State Machine:** Decoupled booking-payment lifecycle where bookings start in `PENDING_PAYMENT` and transition to `CONFIRMED` upon successful payment processing.
* **Stateless JWT Security:** Role-based access control with `USER` and `ADMIN` roles, secured endpoints, and BCrypt password hashing.
* **Admin Dashboard:** Centralized summary metrics for total fleet size, active bookings, and total calculated revenue.
* **Containerization:** Multi-stage Dockerized Spring Boot backend ready for deployment.

---

### Tech Stack

* **Frontend:** React 18, Vite, JavaScript (ES6+), Modern CSS
* **Backend:** Java 17, Spring Boot 3.2.5, Spring Web, Spring Security, Spring Data JPA, JJWT, Jakarta Bean Validation
* **Database:** MySQL 8.0+ (Production/Dev), H2 (Embedded testing)
* **Infrastructure & Tools:** Maven, Docker, Git, GitHub

---

### System Architecture

```text
React Frontend (Vite)
       |
       | HTTP / REST (JSON + Bearer JWT)
       v
Spring Boot Backend
       |
       +--> Controller (Request validation & mapping)
       |       |
       |       v
       +--> Service (Business logic & transactions)
       |       |
       |       v
       +--> Repository (Data access)
               |
               v
             MySQL
Authentication & AuthorizationMotoVerse uses stateless JWT authentication with Spring Security.Public Endpoints: /api/auth/**, /api/vehicles/**Authenticated Endpoints (USER, ADMIN): /api/bookings/**, /api/payments/**Admin-Only Endpoints (ADMIN): /api/dashboard/**Protected requests pass the token in the request header:PlaintextAuthorization: Bearer <jwt_token>
REST API ReferenceThe backend exposes 11 REST endpoints:MethodEndpointPurposeAccess LevelPOST/api/auth/registerRegister a new userPublicPOST/api/auth/loginAuthenticate user and issue JWTPublicGET/api/vehiclesGet all vehiclesPublicGET/api/vehicles/availableFilter available vehiclesPublicGET/api/vehicles/search?keyword=Search vehicles by name, location, or categoryPublicPOST/api/bookingsCreate a booking in PENDING_PAYMENT stateAuthenticatedGET/api/bookingsGet booking history for current userAuthenticatedPOST/api/paymentsProcess payment and confirm linked bookingAuthenticatedGET/api/payments/{id}Get payment details by IDAuthenticatedGET/api/payments/booking/{bookingId}Get payment associated with a bookingAuthenticatedGET/api/dashboard/summaryGet aggregated dashboard metricsAdmin OnlyBooking & Payment LifecycleBookings and payments are separated into a state-driven workflow:PlaintextBooking Created
      |
      v
PENDING_PAYMENT
      |
      v
Payment Request
      |
      +------------------+
      |                  |
      v                  v
   SUCCESS            FAILURE
      |                  |
      v                  v
  CONFIRMED       PAYMENT_FAILED
                         |
                         v
                     CANCELLED
The payable amount is derived directly from the database record:$$\text{Vehicle.pricePerDay} \times \text{rentalDays} \longrightarrow \text{Booking.totalAmount} \longrightarrow \text{Payment.amount}$$Data ModelsPlaintextVehicle                 Booking                     Payment
├── id                  ├── id                      ├── id
├── name                ├── vehicle (FK)            ├── booking (FK)
├── category            ├── customerName            ├── amount
├── location            ├── customerEmail           ├── paymentMethod
├── pricePerDay         ├── rentalDays              ├── status
├── available           ├── totalAmount             ├── transactionId
└── imageUrl            ├── status                  └── createdAt
                        └── createdAt
Project StructurePlaintextmotoverse-fullstack/
├── backend/
│   ├── src/main/java/com/ansh/motoverse/
│   │   ├── config/          # Security & CORS configuration
│   │   ├── controller/      # REST API endpoints
│   │   ├── model/           # JPA entities
│   │   ├── repository/     # Data access layer
│   │   ├── security/       # JWT filters & auth tokens
│   │   └── service/        # Business logic & payment workflows
│   ├── Dockerfile
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── api.js          # API client
    │   ├── main.jsx        # Root component & state management
    │   └── styles.css      # Core styles
    └── package.json
Concepts DemonstratedREST API development with Spring Boot 3Layered Controller-Service-Repository architectureSpring Data JPA entity relationships (@ManyToOne, @OneToMany)Server-side validation via Jakarta Bean Validation (@NotNull, @NotBlank, @Email, @Min)Global exception handling (@RestControllerAdvice)Stateless JWT authentication with Spring Security & BCryptAtomic state machine transitions with @TransactionalFull-stack integration between React (Vite) and Spring Boot
