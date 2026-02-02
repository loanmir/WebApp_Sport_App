# WebApp_Sport_App

## Final Exam Project - Web Application Programming

This is a Sports Web Application designed to manage amateur tournaments and allow users to book sport fields. The project features a complete client-server architecture:

- **Front-end**: A React application for the user interface

- **Back-end**: A Node.js/Express server that handles data storage, authentication, and API logic.


## Docker Architecture

The project uses **Docker** for easy deployment. It runs on two synchronized containers:

  1. **App Container**: Runs the Node.js back-end (which also serves the React front-end).

  2. **Database Container**: runs MongoDB to store all application data.


## How to run the Project

**Prerequisites:**

   - Make sure **Docker Desktop** is installed and running in the background.

**Step-by-Step instructions:**

  1. **Clone** this repository to your computer

  2. Open your terminal inside the project folder.

  3. Run the following command to build and start the application: `docker-compose up --build`

  4. Wait for the logs to show *"Server running on port 8080"* and *"MongoDB Connected successfully!"* 

  5. Open your browser and visit "http://localhost:8080" 


## Database & Demo data

The project includes an automatic **Database Seeder**.

When you run `docker-compose up` for the first time, the application will automatically build the database structure and populate it with the **demo data** (users, tournaments, teams, fields, bookings and matches).

The database files are stored locally in the `data` folder. If you want to reset the database to its original demo state, simply delete the `data` folder and restart Docker.
