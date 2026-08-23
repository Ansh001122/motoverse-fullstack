# 🏍️ MotoVerse — Vehicle Rental Platform

MotoVerse is a full-stack vehicle rental application. Users can browse and search vehicles, check availability, create bookings, and process payments; an admin-facing dashboard provides real-time summary metrics.

Built as a 4-member team project — this repository contains the full-stack system (Spring Boot backend and React frontend) I developed.

---

### Tech Stack

* **Backend:** Java 17, Spring Boot 3.2.5, Spring Data JPA, Spring Security, JWT (`jjwt`), Jakarta Bean Validation
* **Frontend:** React 18, Vite, Axios, Modern CSS
* **Database:** MySQL 8.0+ / H2 (configurable)
* **Infrastructure:** Docker (multi-stage build), Maven, Git/GitHub, deployed via Render / Vercel

---

### Architecture

Layered Spring Boot backend following clean separation of concerns:

```text
React Frontend (Vite)
       │
       │ HTTP / REST (JSON + Bearer JWT)
       ▼
Spring Boot Backend
       │
       ├── Controller (Request routing & DTO validation)
       ├── Service    (Business logic, rate calculation & transactional payment processing)
       ├── Repository (Spring Data JPA interfaces)
       └── Database   (MySQL / H2)
Backend services include vehicle fleet management, dynamic booking, mock payment lifecycle handling, JWT security filtering, and global CORS configuration.Authentication & SecurityStateless authentication implemented using Spring Security and JWT.Custom JwtAuthenticationFilter and token provider validating bearer tokens on protected routes.Role-Based Access Control (RBAC):Public: Vehicle browsing, search, user registration, and login.Customer (USER): Booking creation and personal booking/payment history.Administrator (ADMIN): Protected dashboard metrics (fleet size, active bookings, total revenue).Passwords hashed and verified using BCrypt.REST API ReferenceThe backend exposes 11 REST endpoints:MethodEndpointAccess LevelDescriptionPOST/api/auth/registerPublicRegister a new userPOST/api/auth/loginPublicAuthenticate user and issue JWTGET/api/vehiclesPublicRetrieve all fleet vehiclesGET/api/vehicles/availablePublicGet currently available vehiclesGET/api/vehicles/search?keyword=PublicSearch vehicles by name, category, or locationPOST/api/bookingsUSER, ADMINCreate a booking in PENDING_PAYMENT stateGET/api/bookingsUSER, ADMINGet booking history for authenticated userPOST/api/paymentsUSER, ADMINProcess payment and transition booking to CONFIRMEDGET/api/payments/{id}USER, ADMINRetrieve payment details by IDGET/api/payments/booking/{bookingId}USER, ADMINRetrieve payment record linked to a bookingGET/api/dashboard/summaryADMIN onlyGet operational statistics (fleet count, revenue)Booking & Payment LifecycleA newly created booking is not immediately confirmed:PlaintextBooking Created ──► PENDING_PAYMENT ──► Payment Request ──┬──► SUCCESS ──► CONFIRMED
                                                          └──► FAILURE ──► PAYMENT_FAILED ──► CANCELLED
Server-Side Price Calculation: Prevents frontend price tampering by calculating totals strictly on the server:$$\text{Total Amount} = \text{Price Per Day} \times \text{Rental Days}$$Transactional Guarantee: Payment processing and booking state transitions execute within a single @Transactional boundary.Database & Seed DataUses Spring Data JPA (JpaRepository) with relational mapping (@ManyToOne, @OneToMany).Configured for MySQL 8.0+ with schema scripts and automatic database seeding for the initial Siliguri rental fleet.DockerThe backend uses a multi-stage Docker build (Java 17 + Maven):Bash# Build image
docker build -t motoverse-backend ./backend

# Run container
docker run -p 8080:8080 motoverse-backend
DeploymentBackend: Deployed via Render using render.yaml (auto-deploy on push to main).Frontend: Deployed via Vercel.Running LocallyPrerequisites: Java 17, Maven, Node.js & npm, Git, MySQLBash# 1. Clone repository
git clone [https://github.com/Ansh001122/motoverse-fullstack.git](https://github.com/Ansh001122/motoverse-fullstack.git)
cd motoverse-fullstack

# 2. Run Backend
cd backend
mvn spring-boot:run

# 3. Run Frontend (in a separate terminal)
cd ../frontend
npm install
npm run dev
Backend: http://localhost:8080Frontend: http://localhost:5173Key Concepts DemonstratedSpring Boot 3 REST API development and layered architectureSpring Data JPA entity relationships and persistenceStateless JWT authentication, role authorization, and BCrypt hashingServer-side rate computation and Jakarta Bean ValidationCentralized exception handling (@RestControllerAdvice)Docker containerization and multi-stage packagingFull-stack integration connecting a React (Vite) client to a secure Spring Boot backendFuture ImprovementsProduction payment gateway integration (Razorpay / Stripe)Database concurrency locking to prevent double-bookingAutomated test coverage (JUnit 5, Mockito)Interactive calendar-based date-range selectionAPI documentation with OpenAPI / Swagger UIAuthorAnsh RajSoftware Engineer | Java | Spring Boot | REST APIs | DockerGitHub: https://github.com/Ansh001122LinkedIn: https://linkedin.com/in/Anshraj
