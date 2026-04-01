# Full-Stack Expense Tracker

A modern, responsive Expense Tracking application built with Spring Boot (Java) and Angular (TypeScript). This app features a premium dark UI using glassmorphism.

## Tech Stack
- **Backend:** Spring Boot 3, Spring Data JPA, MySQL
- **Frontend:** Angular 17+ (Standalone Components), HTML5, CSS3, RxJS

## Features
- View all expenses in a responsive data table
- Filter and view expenses with beautiful UI
- Add new expenses with categorizations
- Update existing expenses
- Delete expenses
- MySQL Database Integration with auto-DDL

## Prerequisites
- Node.js (v18 or higher)
- Angular CLI (v17+)
- Java JDK 17
- Maven
- MySQL Server running on localhost:3306

## Setup Instructions

### Database Setup
1. Create a MySQL database named `expense_tracker`:
   ```sql
   CREATE DATABASE expense_tracker;
   ```
2. The application will automatically construct the required tables on startup. Update `application.properties` in `backend/src/main/resources/` if your MySQL username/password is not `root/root`.

### 1. Running the Backend (Spring Boot)
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Run the application using Maven wrapper or directly:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start on `http://localhost:8080`.

### 2. Running the Frontend (Angular)
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   ng serve
   ```
4. Open your browser and navigate to `http://localhost:4200` to view the application!

## Demo API Endpoints
- `GET /api/expenses` - Retrieve all expenses
- `POST /api/expenses` - Add a new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
