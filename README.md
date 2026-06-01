# Motoverse — Vehicle Rental Full Stack Web App

Motoverse is a full-stack vehicle rental platform built for resume and interview demonstration. It includes a Spring Boot REST API, React frontend, booking workflow, vehicle search/filtering, in-memory demo database, and deployment-ready configuration.

## Tech Stack

**Backend:** Java 17, Spring Boot 3, Spring Data JPA, H2 Database, Maven, Docker

**Frontend:** React, Vite, JavaScript, CSS, Axios

## Features
- View available rental vehicles
- Filter vehicles by category
- Search vehicles by brand/model/location
- Create bookings
- View booking history
- Dashboard metrics
- REST API integration
- CORS enabled for frontend deployment

## Run Locally

### Backend
```bash
cd backend
mvn spring-boot:run
```
Backend: `http://localhost:8080`

H2 Console: `http://localhost:8080/h2-console`

JDBC URL: `jdbc:h2:mem:motoverse`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend: `http://localhost:5173`

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/vehicles` | Get all vehicles |
| GET | `/api/vehicles/available` | Get available vehicles |
| GET | `/api/vehicles/search?keyword=` | Search vehicles |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/dashboard/summary` | Dashboard summary |

## Deployment

### Backend on Render
Render supports Docker-based deployment and can build from a Dockerfile in your GitHub repository. Create a new Web Service, connect your repo, set root directory to `backend`, and use Docker deployment.

Environment variables:
```text
SPRING_PROFILES_ACTIVE=prod
CORS_ALLOWED_ORIGINS=https://your-vercel-frontend-url.vercel.app
```

### Frontend on Vercel
Vercel supports Vite projects. Import the `frontend` folder as a Vercel project.

Environment variable:
```text
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

## Resume Bullet
Built Motoverse, a full-stack vehicle rental platform using Java, Spring Boot, React, REST APIs, and H2/MySQL-ready persistence. Implemented vehicle search, booking workflow, dashboard metrics, API integration, and deployment-ready configuration using Docker, Render, and Vercel.
