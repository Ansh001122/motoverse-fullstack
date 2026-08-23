# MotoVerse — Vehicle Rental Platform

MotoVerse is a full-stack vehicle rental platform built with React and Spring Boot. Users can browse vehicles, search by vehicle details, check availability, create bookings, and view rental statistics.

The backend uses Spring Data JPA with an H2 database for the current development configuration. It also includes Docker support and stateless JWT authentication.

> This repository currently contains a single Spring Boot backend using a layered Controller → Service → Repository architecture. It is not yet split into independent microservices.

## Features

- Browse and search vehicles
- Filter available vehicles
- Create vehicle rental bookings
- Server-side rental-price calculation
- Request validation
- Centralized exception handling
- JWT authentication with Spring Security
- USER and ADMIN roles
- Admin-only dashboard endpoint
- Dockerized Spring Boot backend

## Tech Stack

### Frontend
- React
- JavaScript
- HTML/CSS

### Backend
- Java (7,17)
- Spring Boot 3.2.5
- Spring Web
- Spring Security
- Spring Data JPA
- Jakarta Bean Validation
- JJWT

### Database
- H2 for the current development configuration
- MySQL 

### Tools
- Maven
- Docker
- Git
- GitHub

## Architecture

```text
React Frontend
      |
      | HTTP / REST
      v
Spring Boot Backend
      |
      +--> Controller
      |       |
      |       v
      +--> Service
      |       |
      |       v
      +--> Repository
              |
              v
             H2
```

## Authentication

MotoVerse uses stateless JWT authentication with Spring Security.

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

New registrations receive the `USER` role.

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "token": "<jwt>",
  "email": "user@example.com",
  "role": "USER"
}
```

Use the token for protected requests:

```http
Authorization: Bearer <jwt>
```

### Authorization

| Endpoint | Access |
|---|---|
| `/api/auth/**` | Public |
| `/api/vehicles/**` | Public |
| `/api/bookings/**` | USER or ADMIN |
| `/api/dashboard/**` | ADMIN only |

Passwords are stored using BCrypt hashing. JWTs are validated by a stateless authentication filter.

### Creating an Admin User

For local development, set:

```bash
APP_ADMIN_EMAIL=admin@example.com
APP_ADMIN_PASSWORD=change-me
```

The application creates the admin account if it does not already exist.

JWT configuration:

```bash
JWT_SECRET=<at-least-32-byte-secret>
JWT_EXPIRATION_MS=3600000
```

Use a strong secret in production.

## REST API Reference

The backend now exposes **11 REST API endpoints**.

| # | Method | Endpoint | Purpose |
|---|---|---|---|
| 1 | POST | `/api/auth/register` | Register a user |
| 2 | POST | `/api/auth/login` | Authenticate and issue JWT |
| 3 | GET | `/api/vehicles` | Get all vehicles |
| 4 | GET | `/api/vehicles/available` | Get available vehicles |
| 5 | GET | `/api/vehicles/search?keyword=` | Search vehicles |
| 6 | POST | `/api/bookings` | Create booking |
| 7 | GET | `/api/bookings` | Get bookings |
| 8 | GET | `/api/dashboard/summary` | Get dashboard statistics |

### Booking Workflow

```text
Client
  |
  | POST /api/bookings
  v
BookingController
  |
  | validate request
  v
BookingService
  |
  +--> Find vehicle
  +--> Check availability
  +--> Calculate rental amount
  +--> Save booking
  |
  v
BookingRepository
  |
  v
Database
```

Rental amount is calculated on the server:

```text
Total Amount = Price Per Day × Rental Days
```

## Data Model

### Vehicle

```text
Vehicle
├── id
├── name
├── category
├── location
├── pricePerDay
├── available
└── imageUrl
```

### Booking

```text
Booking
├── id
├── vehicle
├── customerName
├── customerEmail
├── rentalDays
├── totalAmount
├── createdAt
└── status
```

A booking references one vehicle using a JPA `@ManyToOne` relationship.

## Validation and Exception Handling

The backend uses Jakarta Bean Validation including:

- `@NotNull`
- `@NotBlank`
- `@Email`
- `@Min`

A centralized `GlobalExceptionHandler` handles validation and business exceptions and returns structured HTTP 400 responses.

## Docker

The backend includes a multi-stage Docker build using Maven and Java 17.

Build:

```bash
cd backend
docker build -t motoverse-backend .
```

Run:

```bash
docker run -p 8080:8080 motoverse-backend
```

The backend is then available at:

```text
http://localhost:8080
```

## Running Locally

### Prerequisites

- Java 17
- Maven
- Node.js and npm
- Git
- Docker (optional)

### Clone

```bash
git clone https://github.com/Ansh001122/motoverse-fullstack.git
cd motoverse-fullstack
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

The backend runs on port `8080`.

### Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses:

```text
VITE_API_BASE_URL
```

to determine the backend URL. If it is not provided, it defaults to:

```text
http://localhost:8080
```

## Project Structure

```text
motoverse-fullstack/
├── backend/
│   ├── src/main/java/com/ansh/motoverse/
│   │   ├── auth/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── Dockerfile
│   ├── render.yaml
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── api.js
    │   ├── main.jsx
    │   └── styles.css
    └── package.json
```

## Backend Concepts Demonstrated

- REST API development
- Spring Boot
- Controller-Service-Repository architecture
- Spring Data JPA
- Entity relationships
- Request validation
- Server-side business logic
- JWT authentication
- BCrypt password hashing
- Role-based authorization
- Global exception handling
- Docker containerization
- React-to-Spring Boot integration

## Current Limitations / Future Improvements

- Database-level concurrency control to prevent double booking
- Payment gateway integration
- Automated unit and integration tests
- OpenAPI/Swagger documentation
- Production database configuration
- API Gateway
- Service-to-service communication
- Extraction into independent microservices when the system requirements justify it

## Author

**Ansh Raj**

Software Engineer | Java | Spring Boot | REST APIs | Docker

GitHub: https://github.com/Ansh001122
LinkedIn: https://linkedin.com/in/Anshraj


---
## Payment APIs — Phase 2.1

MotoVerse now includes a booking-payment state transition. The current payment implementation uses **simulated payment processing**; no real money is transferred.

### Booking Lifecycle

A newly created booking is no longer immediately confirmed.

```text
Booking Created
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
  SUCCESS             FAILURE
      |                  |
      v                  v
 CONFIRMED        PAYMENT_FAILED
                         |
                         v
                    CANCELLED
```

The current implementation executes the successful path. The `PAYMENT_FAILED` state is modeled so a real payment gateway can be integrated later without changing the booking state model.

### Create Booking

```http
POST /api/bookings
```

The booking service:

1. Validates the booking request.
2. Finds the selected vehicle.
3. Checks vehicle availability.
4. Calculates the total rental amount from the database price.
5. Creates the booking with `PENDING_PAYMENT`.

Example:

```json
{
  "vehicleId": 1,
  "customerName": "Ansh Raj",
  "customerEmail": "ansh@example.com",
  "rentalDays": 3
}
```

### Create Payment

```http
POST /api/payments
```

Request:

```json
{
  "bookingId": 101,
  "paymentMethod": "CARD"
}
```

The client does **not** provide the payment amount. The payment service reads `booking.totalAmount` from the database.

Successful flow:

```text
POST /api/payments
        |
        v
Find booking
        |
        v
Check duplicate payment
        |
        v
Read booking.totalAmount
        |
        v
Simulate payment success
        |
        +--> Payment.status = SUCCESS
        |
        +--> Generate transaction ID
        |
        +--> Booking.status = CONFIRMED
        |
        v
Persist payment
```

The payment operation is transactional, so the booking confirmation and payment persistence are performed as part of the same service transaction.

### Get Payment

```http
GET /api/payments/{id}
```

Returns a payment by its ID.

### Get Payment by Booking

```http
GET /api/payments/booking/{bookingId}
```

Returns the payment associated with a booking.

### Payment Data Model

```text
Payment
├── id
├── booking
├── amount
├── paymentMethod
├── status
├── transactionId
└── createdAt
```

### Payment States

```text
PENDING
SUCCESS
FAILED
REFUNDED
```

### Booking States

```text
PENDING_PAYMENT
CONFIRMED
PAYMENT_FAILED
CANCELLED
```

### Important Implementation Detail

The backend derives the payable amount from the booking:

```text
Vehicle price per day × rental days
                ↓
          Booking.totalAmount
                ↓
          Payment.amount
```

This prevents the frontend from deciding what amount should be charged.

The current payment processor is a mock implementation. A real Razorpay/Stripe integration can later replace the simulated processing while keeping the same booking/payment state model.

---

## Current REST API Count

MotoVerse currently exposes **11 REST API endpoints**:

| # | Method | Endpoint | Purpose |
|---|---|---|---|
| 1 | POST | `/api/auth/register` | Register user |
| 2 | POST | `/api/auth/login` | Authenticate user and issue JWT |
| 3 | GET | `/api/vehicles` | Get all vehicles |
| 4 | GET | `/api/vehicles/available` | Get available vehicles |
| 5 | GET | `/api/vehicles/search?keyword=` | Search vehicles |
| 6 | POST | `/api/bookings` | Create booking in `PENDING_PAYMENT` state |
| 7 | GET | `/api/bookings` | Get bookings |
| 8 | GET | `/api/dashboard/summary` | Get dashboard statistics |
| 9 | POST | `/api/payments` | Process simulated payment |
| 10 | GET | `/api/payments/{id}` | Get payment |
| 11 | GET | `/api/payments/booking/{bookingId}` | Get payment by booking |

---

## Phase 2.1 Design Notes

The booking/payment separation is intentionally implemented before extracting microservices.

Current architecture:

```text
React Frontend
       |
       v
Spring Boot Backend
       |
   +---+----------------+
   |                    |
Booking Service    Payment Service
   |                    |
   +--------+-----------+
            |
            v
          MySQL
```

The next architectural step is to extract these responsibilities into independent services only after the state transitions and business rules are stable.
