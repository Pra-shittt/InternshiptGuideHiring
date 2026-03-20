# HireFlow — Smart Interview Preparation & Talent Hiring Platform

## Project Structure

This project is divided into two main parts:

- **/frontend**: React + Vite + Tailwind CSS frontend application.
- **/backend**: Node.js + Express + MongoDB backend API.

## Getting Started

1. **Install Dependencies**:
   From the root directory, run:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Create `backend/.env` using `backend/.env.example` as a template.
   - Set your `MONGODB_URI` and `JWT_SECRET`.

3. **Seed the Database**:
   ```bash
   npm run seed
   ```

4. **Run the Application**:
   You can start both frontend and backend concurrently from the root:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`

## Features

- **Advanced IDE Assessment**: A realistic coding playground with real-time test case execution and console output.
- **Job Board & Applications**: Complete hiring pipeline from job posting to shortlisting.
- **Candidate Profiles**: Skill tracking and solved-question history.
- **Technical Rounds**: Simulated technical interview assessments.
