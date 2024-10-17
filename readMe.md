# Sentics Task

## Description
This project implements a real-time data visualization application using React for the frontend, Node.js for the backend, and MySQL for data storage.

## Features
- **Data Ingestion**: Stores data from a JSON file in a MySQL database.
- **API Endpoints**:
  - **POST /api/data**: Insert new data into the database.
  - **GET /api/data**: Retrieve averaged data based on user-selected timeframes.
- **Frontend Components**:
  - Graph displaying data with options for X Position, Y Position, and Number of Humans.
  - Positional heatmap visualizing X and Y positions with intensity values.

## Getting Started
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Mohib997/sentics-task.git

1. Navigate to the Project Directory:
    cd sentics-task

2. Install Dependencies:
    npm install

3. Run the Backend Server:
    node index.js

4. Run the Frontend Application:
    cd frontend
    npm start

