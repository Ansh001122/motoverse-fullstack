 🏍️ MotoVerse — Full-Stack Vehicle Rental Platform

<p align="center">
  <strong>An enterprise-grade, full-stack vehicle rental and fleet management platform engineered for regional mobility operations across North Bengal and Sikkim.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Security-JWT_Stateless-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

## 📌 Project Overview

**MotoVerse** is an end-to-end vehicle rental platform designed to streamline fleet discovery, reservation scheduling, and transaction handling. Operating around the Siliguri transit corridor, the system provides riders with transparent, on-demand bike rentals and provides operators with administrative control over fleet availability, reservations, and generated revenue.

The project demonstrates clean software engineering principles: strict separation of concerns, robust server-side business validation, relational data modeling with transactional integrity, and stateless security.

---

## 🛠️ Technology Stack & Tools

### 🌐 Frontend Architecture
* **Library / Framework:** React 18
* **Build Tooling:** Vite 5.4 (Hot Module Replacement)
* **Networking:** Axios / Fetch API with central interceptors for JWT injection
* **Styling & UI:** Responsive CSS3, custom card layouts, and status-driven badges

### ⚙️ Backend Architecture
* **Language & Runtime:** Java 17 (LTS)
* **Framework:** Spring Boot 3.2.5
* **Security Layer:** Spring Security 6, JJWT (`io.jsonwebtoken`), BCrypt password hashing
* **Data Access & ORM:** Spring Data JPA, Hibernate 6
* **Validation Layer:** Jakarta Bean Validation (`@NotNull`, `@NotBlank`, `@Email`, `@Min`)
* **Exception Strategy:** Centralized `@RestControllerAdvice` with structured JSON error payloads

### 🗄️ Database & Infrastructure
* **Database Engine:** MySQL 8.0+ (with automated data seeding & H2 compatibility)
* **Containerization:** Multi-stage Docker builds optimized for minimal image footprint
* **Deployment Workflows:** Render (Backend API via `render.yaml`) & Vercel (Frontend Client)
* **Source Control:** Git, GitHub

---

## 🏛️ System Architecture & Workflow

MotoVerse follows a **layered enterprise architecture** to guarantee high maintainability and testability:

```text
                                 ┌─────────────────────────────────┐
                                 │     React Frontend (Vite)       │
                                 │  http://localhost:5173 (Client) │
                                 └────────────────┬────────────────┘
                                                  │
                                                  │ HTTP / REST (JSON + Bearer JWT)
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │     Spring Security Filter      │
                                 │    (JwtAuthenticationFilter)    │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │      REST Controller Layer      │
                                 │ (Request Validation & Routing)  │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │      Business Service Layer     │
                                 │  (@Transactional State Logic)   │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │      Data Repository Layer      │
                                 │       (Spring Data JPA)         │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │          MySQL Engine           │
                                 │   (motoverse_db: Tables & FKs)  │
                                 └─────────────────────────────────┘
🌟 Key Application Features1. 🔍 Dynamic Fleet Catalog & SearchReal-time query engine supporting search across bike models, categories (Adventure, Cruiser, Naked, Scooter, Sport, Tourer), and locations (Siliguri Hub).Instant vehicle availability verification before initiating reservation requests.2. 🛡️ Server-Side Calculation & SecurityPrevents client-side price tampering by computing financial totals strictly on the backend:$$\text{Total Amount} = \text{Vehicle.pricePerDay} \times \text{rentalDays}$$All incoming requests are strictly validated using Jakarta constraints before execution.3. 🔄 Transactional Booking & Payment Lifecycle (Phase 2.1)Decoupled booking and payment services ensure clear state transitions and business accountability:Plaintext  [ User Initiates Booking ] 
              │
              ▼
    ( Status: PENDING_PAYMENT )
              │
              ▼
   [ Trigger Mock Payment ]
         │          │
    (Success)    (Failure)
         │          │
         ▼          ▼
   ( CONFIRMED )  ( PAYMENT_FAILED )
                        │
                        ▼
                   ( CANCELLED )
Transactional Consistency: Payment record persistence and booking status transitions execute inside a single @Transactional boundary, preventing orphaned transactions.Payload Integrity: The client only sends the bookingId and paymentMethod. The backend retrieves the exact payable amount directly from the persisted booking.4. 🔐 Role-Based Access Control (RBAC)Public: Fleet catalog discovery, search, user registration, and authentication.Customer (USER): Fleet booking creation, personal reservation lookup, and payment processing.Administrator (ADMIN): Dedicated analytics dashboard aggregating total fleet units, active bookings, and total realized revenue.📡 Comprehensive REST API ReferenceThe backend exposes 11 REST endpoints:MethodEndpointAccess LevelDescriptionPOST/api/auth/registerPublicRegisters a new customer account (USER role)POST/api/auth/loginPublicAuthenticates credentials and returns signed JWTGET/api/vehiclesPublicFetches complete fleet inventoryGET/api/vehicles/availablePublicFilters vehicles where available = trueGET/api/vehicles/search?keyword=PublicQueries fleet by vehicle model, category, or locationPOST/api/bookingsUSER, ADMINInitiates a booking in PENDING_PAYMENT stateGET/api/bookingsUSER, ADMINFetches booking history for current authenticated userPOST/api/paymentsUSER, ADMINProcesses payment and transitions booking to CONFIRMEDGET/api/payments/{id}USER, ADMINRetrieves specific payment record by IDGET/api/payments/booking/{bookingId}USER, ADMINRetrieves payment details associated with a bookingGET/api/dashboard/summaryADMIN onlyReturns aggregated operational metrics and revenue🗄️ Relational Database SchemaPlaintext┌─────────────────────────┐         ┌──────────────────────────────┐
│        app_user         │         │           vehicle            │
├─────────────────────────┤         ├──────────────────────────────┤
│ id           (PK, BIGINT│         │ id                (PK, BIGINT│
│ email       VARCHAR(255)│         │ name             VARCHAR(255)│
│ password    VARCHAR(255)│         │ category         VARCHAR(100)│
│ role         VARCHAR(50)│         │ location         VARCHAR(255)│
└─────────────────────────┘         │ price_per_day          DOUBLE│
                                    │ available             BOOLEAN│
                                    │ image_url        VARCHAR(500)│
                                    └──────────────┬───────────────┘
                                                   │ 1
                                                   │ has many
                                                   │ N
┌─────────────────────────┐ 1       N ┌────────────┴───────────────┐
│         payment         │◄──────────┤           booking            │
├─────────────────────────┤ has one   ├──────────────────────────────┤
│ id           (PK, BIGINT│           │ id                (PK, BIGINT│
│ booking_id  (FK, BIGINT)│           │ vehicle_id        (FK, BIGINT│
│ amount            DOUBLE│           │ customer_name    VARCHAR(255)│
│ payment_method VARCHAR(50│          │ customer_email   VARCHAR(255)│
│ status       VARCHAR(50)│           │ rental_days             INT  │
│ transaction_id VARCHAR(255│         │ total_amount         DOUBLE  │
│ created_at   DATETIME(6)│           │ status          VARCHAR(50)  │
│                         │           │ created_at       DATETIME(6) │
└─────────────────────────┘           └──────────────────────────────┘
📂 Project Directory StructurePlaintextmotoverse-fullstack/
├── backend/
│   ├── src/main/java/com/ansh/motoverse/
│   │   ├── config/              # Security filter chain, CORS & WebConfig
│   │   ├── controller/          # REST endpoints (Auth, Vehicle, Booking, Admin)
│   │   ├── dto/                 # Request & Response Data Transfer Objects
│   │   ├── exception/           # GlobalExceptionHandler & custom exceptions
│   │   ├── model/               # JPA Entities (AppUser, Vehicle, Booking, Payment)
│   │   ├── repository/          # Spring Data JPA interfaces
│   │   ├── security/            # JWT Token Provider, Filters & AuthEntryPoint
│   │   └── service/             # Core business logic & payment transactions
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql             # Fallback database seeding
│   ├── Dockerfile               # Multi-stage container definition
│   └── pom.xml                  # Maven dependencies & build plugins
│
├── frontend/
│   ├── src/
│   │   ├── api.js              # Centralized Axios API client & token injection
│   │   ├── main.jsx            # Core application layout, UI state & components
│   │   └── styles.css          # Responsive design stylesheet
│   ├── index.html              # HTML5 entry point
│   ├── package.json            # Node.js dependencies & scripts
│   └── vite.config.js          # Vite server & proxy configuration
│
├── render.yaml                  # Cloud deployment configuration
└── README.md
🚀 Local Development Setup📋 PrerequisitesJava Development Kit (JDK): Version 17 or higherApache Maven: Version 3.8+Node.js & npm: Node 18+ and npm 9+MySQL Server: Version 8.0 or higherGit: Version Control1. Database InitializationOpen your MySQL client or MySQL Workbench and execute:SQLDROP DATABASE IF EXISTS motoverse_db;
CREATE DATABASE motoverse_db;
USE motoverse_db;

CREATE TABLE IF NOT EXISTS app_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicle (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price_per_day DOUBLE NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS booking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rental_days INT NOT NULL,
    total_amount DOUBLE NOT NULL,
    created_at DATETIME(6),
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_booking_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    created_at DATETIME(6),
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);

INSERT INTO vehicle (name, category, location, price_per_day, available, image_url) VALUES
('Royal Enfield Himalayan 450', 'Adventure', 'Siliguri', 1800.00, true, '[https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80)'),
('KTM 390 Adventure', 'Adventure', 'Siliguri', 2000.00, true, '[https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80)'),
('Royal Enfield Hunter 350', 'Cruiser', 'Siliguri', 1300.00, true, '[https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80)'),
('Yamaha MT-15 V2', 'Naked', 'Siliguri', 1100.00, true, '[https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80)'),
('BMW G 310 GS', 'Adventure', 'Siliguri', 2500.00, true, '[https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80)'),
('Bajaj Dominar 400', 'Tourer', 'Siliguri', 1400.00, true, '[https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&auto=format&fit=crop&q=80)'),
('Suzuki V-Strom SX 250', 'Adventure', 'Siliguri', 1500.00, true, '[https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80)'),
('Honda Activa 6G', 'Scooter', 'Siliguri', 600.00, true, '[https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600&auto=format&fit=crop&q=80)'),
('TVS NTORQ 125', 'Scooter', 'Siliguri', 700.00, true, '[https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600&auto=format&fit=crop&q=80)'),
('Kawasaki Ninja 300', 'Sport', 'Siliguri', 2800.00, true, '[https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80](https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80)');
2. Backend StartupUpdate backend/src/main/resources/application.properties with your MySQL root password:Propertiesspring.datasource.url=jdbc:mysql://localhost:3306/motoverse_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD

app.jwt.secret=9a7c3b2e5f8a1d4c7b0e3a6f9c2d5e8b1a4f7c0d3e6a9b2c5e8f1a4d7b0c3e6f
app.jwt.expiration-ms=3600000

app.admin.email=anshrajconnect00@gmail.com
app.admin.password=anshraj1234
Build and launch the Spring Boot service:Bashcd backend
mvn clean spring-boot:run
The API will start listening on http://localhost:8080.3. Frontend StartupIn a separate terminal window:Bashcd frontend
npm install
npm run dev
The React client will launch on http://localhost:5173.🐳 Containerization (Docker)The project includes an optimized multi-stage Dockerfile to package and run the Spring Boot service independently:Bash# 1. Build the production Docker image
cd backend
docker build -t motoverse-backend .

# 2. Run the containerized service
docker run -d -p 8080:8080 --name motoverse-api motoverse-backend
🔮 Engineering Roadmap[ ] Payment Gateway Integration: Replace mock transaction logic with real Razorpay / Stripe webhooks.[ ] Pessimistic / Optimistic Concurrency Locking: Prevent race conditions during high-concurrency booking of the same vehicle.[ ] Interactive Date-Range Picker: Upgrade from integer rental days to calendar-based startDate and endDate availability checks.[ ] Automated Test Suite: Implement unit and integration tests using JUnit 5, Mockito, and Testcontainers.[ ] OpenAPI / Swagger Documentation: Add interactive API testing documentation via Springdoc OpenAPI UI.
👨‍💻 AuthorAnsh RajSoftware Engineer | Java • Spring Boot • SQL • React • DockerGitHub:
LinkedIn 
https://www.linkedin.com/in/anshrajconnect/
