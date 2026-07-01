# 🏍️ MotoVerse: Production-Scale Vehicle Rental Platform

**MotoVerse** is a modern, high-concurrency full-stack vehicle rental application designed to streamline two-wheeler browsing, discovery, and reservation lifecycles. Built using an enterprise-ready Java backend and a reactive frontend architecture, the platform features robust REST APIs, precise database indexing, automated CI/CD pipelines, and a containerized infrastructure built for modern cloud deployments.

---

## 🚀 Architectural Features & Core Engineering

* **Stateless Security Gateway:** Protected by token-based authentication mechanisms utilizing **JWT tokens** and **Spring Security** for rigid service-boundary protection.
* **Concurrent Booking Management:** Engineered to handle high-concurrency rental transactions safely, showcasing production-grade double-booking prevention.
* **Database Performance Tuning:** Relational schemas optimized using strategic foreign key indexing and advanced queries, reducing latency by **~40%** under simulated load testing.
* **Automated Engineering Lifecycle:** Configured with decoupled pipeline workflows (**Jenkins** & **GitHub Actions**) for continuous compilation, comprehensive unit testing, and containerized delivery.

---

## 🛠️ Tech Stack

### Backend Architecture
* **Core Ecosystem:** Java 17, Spring Boot, Spring Data JPA, Spring MVC
* **Security Framework:** Spring Security, JSON Web Tokens (JWT)
* **Testing Suite:** JUnit, Mockito (Test-Driven Development practices)

### Frontend Architecture
* **Core:** React, JavaScript (ES6+), HTML5, CSS3
* **Tooling:** Vite, Responsive Design Frameworks

### Infrastructure, DevOps & Databases
* **Databases:** PostgreSQL / MySQL (Production), H2 Database (In-Memory Development)
* **Containerization:** Docker, Docker Compose
* **CI/CD & Tools:** Jenkins, GitHub Actions, Git, JIRA (Agile/Scrum tracking)

---

## 📐 System Features & User Workflows

### 🔐 Auth & Core Security
* Complete stateless validation across API endpoints.
* Built-in Cross-Origin Resource Sharing (CORS) configurations mapped for secure frontend-to-backend communication.

### 🚲 Fleet Inventory Engine
* Advanced real-time vehicle indexing by status, category, brand, model, and physical location.
* Administrative overview panel featuring critical system dashboard metrics.

### 📅 Booking Pipeline
* End-to-end interactive rental workflow with dynamic booking state validation and historical logs tracking.

---

## 📋 Production API Reference

| HTTP Method | API Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/vehicles` | Retrieve comprehensive fleet inventory |
| **GET** | `/api/vehicles/available` | Filter active inventory by real-time availability |
| **GET** | `/api/vehicles/search?keyword=` | Dynamic keyword search across brand, model, and location |
| **POST** | `/api/bookings` | Execute a transactional vehicle reservation |
| **GET** | `/api/bookings` | Retrieve user/system-wide booking historical logs |
| **GET** | `/api/dashboard/summary` | Aggregate analytics data for operational metrics |

---

## 📦 Local Deployment Guide

### Prerequisites
* Java Development Kit (JDK) 17
* Node.js (v16+) & npm
* Apache Maven

### 1. Launch Backend API Server
```bash
cd backend
mvn clean install
mvn spring-boot:run


'''bash
cd frontend
npm install
npm run dev

Backend Deployment (Render)
SPRING_PROFILES_ACTIVE=prod
CORS_ALLOWED_ORIGINS=[https://your-vercel-frontend-url.vercel.app](https://your-vercel-frontend-url.vercel.app)

Frontend Deployment (Vercel)
VITE_API_BASE_URL=[https://your-render-backend-url.onrender.com](https://your-render-backend-url.onrender.com)

---

### Key Upgrades Made:
1. **Professionalized Terminology:** Replaced basic feature text with backend-focused metrics engineering phrases (e.g., *"Stateless Security Gateway"*, *"Transactional vehicle reservation"*). This mirrors the advanced language on your resume[cite: 1, 2].
2. **Explicit Resume Alignment:** Highlighted concepts like **JWT, 40% query latency optimization, Docker, Jenkins, and GitHub Actions** explicitly within the technical descriptions so a recruiter reviewing your code links it directly to your credentials[cite: 1, 2].
3. **Structured API Table:** Standardized table styling to make your REST endpoints immediately scannable for engineering interviewers.

