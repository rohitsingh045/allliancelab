# Alliance Health Hub — MERN Stack

A full-stack diagnostic lab management website built with the **MERN** stack (MongoDB, Express, React, Node.js).

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui     |
| Backend  | Node.js, Express.js                          |
| Database | MongoDB + Mongoose                           |
| Styling  | Tailwind CSS, Radix UI primitives            |

## Project Structure

```
alliance-health-hub-main/
├── server/                  # Express.js backend
│   ├── models/              # Mongoose schemas
│   │   ├── Test.js
│   │   ├── HealthCondition.js
│   │   ├── SampleReport.js
│   │   └── Booking.js
│   ├── routes/              # API routes
│   │   ├── tests.js
│   │   ├── healthConditions.js
│   │   ├── sampleReports.js
│   │   └── bookings.js
│   ├── index.js             # Express server entry
│   ├── seed.js              # Database seed script
│   ├── .env                 # Server env vars
│   └── package.json
├── src/                     # React frontend
│   ├── api/client.js        # API fetch functions
│   ├── components/          # React components (JSX)
│   │   ├── ui/              # shadcn/ui components
│   │   └── *.jsx            # App components
│   ├── hooks/               # Custom hooks
│   ├── lib/utils.js         # Utility functions
│   ├── pages/               # Page components
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
├── .env                     # Frontend env vars
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Frontend dependencies
```

## Prerequisites

- **Node.js** >= 18
- **MongoDB** running locally on `mongodb://localhost:27017`
  - Or update `server/.env` with your MongoDB connection string

## Getting Started

### 1. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Set up MongoDB & seed data

Make sure MongoDB is running, then:

```bash
cd server
npm run seed
cd ..
```

This populates the database with 12 diagnostic tests, 12 health conditions, and 5 sample reports.

### 3. Start the backend

```bash
cd server
npm run dev
```

The API server runs on **http://localhost:5000**.

### 4. Start the frontend (in a new terminal)

```bash
npm run dev
```

The frontend runs on **http://localhost:8080** with Vite's dev server, which proxies `/api` requests to the backend.

### Or run both together

```bash
npm run dev:all
```

## API Endpoints

| Method | Endpoint                          | Description                   |
| ------ | --------------------------------- | ----------------------------- |
| GET    | `/api/tests`                      | Get all tests (with filters)  |
| GET    | `/api/tests/categories`           | Get all test categories       |
| GET    | `/api/tests/:id`                  | Get single test               |
| POST   | `/api/tests`                      | Create a test                 |
| PUT    | `/api/tests/:id`                  | Update a test                 |
| DELETE | `/api/tests/:id`                  | Delete a test                 |
| GET    | `/api/health-conditions`          | Get all health conditions     |
| GET    | `/api/health-conditions/:slug`    | Get condition by slug         |
| POST   | `/api/health-conditions`          | Create a condition            |
| PUT    | `/api/health-conditions/:slug`    | Update a condition            |
| DELETE | `/api/health-conditions/:slug`    | Delete a condition            |
| GET    | `/api/sample-reports`             | Get all sample reports        |
| GET    | `/api/sample-reports/by-test/:id` | Get report for specific test  |
| POST   | `/api/bookings`                   | Create a booking              |
| GET    | `/api/bookings`                   | Get all bookings              |
| PUT    | `/api/bookings/:id`               | Update booking status         |

## Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alliance-health-hub
```
