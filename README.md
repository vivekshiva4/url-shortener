# URL Shortener Service

This URL shortener service allows users to generate short URLs from long links, manage their URLs via user accounts, and track usage. The service is built with a Node.js/Express backend and a React frontend, both written in TypeScript. PostgreSQL is used as the database, and the entire stack is containerized using Docker and orchestrated via Docker Compose.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies & Languages](#technologies--languages)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running with Docker Compose](#running-with-docker-compose)
  - [Running Locally (Without Docker)](#running-locally-without-docker)

---

## Overview

This project is a URL shortener service where users can:

- Create shortened URLs from long links.
- Optionally choose custom slugs for their URLs.
- Register and log in to manage their shortened URLs.
- Track how many times a short URL is accessed.
- Benefit from rate limiting to prevent abuse.

When a short URL is visited, the service redirects the user to the original URL and increments a visit counter.

---

## Features

- **URL Shortening:**  
  Create a short URL from any valid long URL. Optionally, a custom slug can be provided if it is not already in use.
  
- **Redirection:**  
  Accessing a short URL (e.g., `http://localhost:5000/abc123`) automatically redirects to the stored long URL and updates the visit count.

- **User Authentication:**  
  Users can register and log in. JWT tokens are used for authentication, and user passwords are securely hashed.

- **Dashboard:**  
  Logged-in users can view a list of all URLs they have created along with visit statistics.

- **Validation & Error Handling:**  
  Both frontend and backend provide validations (e.g., proper URL format) and consistent JSON error responses.

- **Rate Limiting:**  
  The backend limits the number of API requests per IP to help prevent abuse.

- **Containerization:**  
  The entire project is containerized using Docker with separate containers for the backend, frontend, and PostgreSQL database.

---

## Technologies & Languages

- **Backend:**  
  - **Language:** TypeScript (running on Node.js)  
  - **Frameworks/Libraries:** Express, TypeORM, jsonwebtoken, bcryptjs, express-rate-limit, pino  
  - **Database:** PostgreSQL  
  - **Other:** dotenv for environment variables

- **Frontend:**  
  - **Language:** TypeScript (using React)  
  - **Libraries:** React, React Router, react-scripts

- **DevOps & Containerization:**  
  - Docker  
  - Docker Compose

---

## API Endpoints

All API responses follow a JSON format similar to JSON:API with nested `data.attributes` for success responses and an `errors` array for errors.

- **User Registration**: `POST /api/v1/register`
- **User Login**: `POST /api/v1/login`
- **Create a Short URL**: `POST /api/v1/shorten`
- **Get User's URLs (Dashboard)**:`GET /api/v1/user/urls`
- **Redirect to Original URL**: `GET /:slug`



## Installation & Setup

### Prerequisites

- Docker and Docker Compose installed on your machine.
- (Optional) Node.js installed if you wish to run the projects without Docker.

### Environment Variables

Create a `.env` file inside the `backend` directory with the following (adjust values as needed):

```dotenv
# backend/.env

NODE_ENV=development
PORT=5000

# PostgreSQL Settings
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name

# JWT Settings
JWT_SECRET=your_jwt_secret

# Logging
LOG_LEVEL=info
```
# Running the Project

This section provides instructions for running the project using Docker Compose as well as running it locally without Docker.

---

## Running with Docker Compose

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vivekshiva4/url-shortener.git
   cd url-shortener
   ```
2. **Build and start all services:**

    ```bash
   docker-compose up --build
   ```
This command will:

- Build the Docker images for the backend and frontend.
- Start a PostgreSQL container.
- Launch the backend server (listening on port 5000).
- Launch the frontend application (listening on port 3000).

Access the services:
- Frontend: Open your browser and navigate to http://localhost:3000.
- Backend APIs: Accessible at http://localhost:5000/api/v1/ (for example, http://localhost:5000/api/v1/login).


## Running Locally (Without Docker)

***Backend***
- Navigate to the backend directory:
   ```
   cd backend
   npm install
   npm run build
   npm start
   Note: Ensure PostgreSQL is running on your machine and your .env file is correctly configured.
   ```
***Frontend***
- Navigate to the frontend directory:
   ```
   cd frontend
   npm install
   npm start
   The application will open in your default browser at http://localhost:3000.
   ```
