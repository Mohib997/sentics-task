# Real-Time Data Visualization

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

## Data Import
The application includes a Python script for importing data from a JSON file into the MySQL database. The script handles the following tasks:
1. Establishes a connection to the MySQL database.
2. Loads a JSON file containing human data.
3. Iterates through the records and inserts them into the database.

### Python Script for Data Import
```python
import json
import mysql.connector

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",
        database="real_time_data"
    )
    cursor = db.cursor()
    print("Database connection successful.")
except mysql.connector.Error as err:
    print(f"Error: {err}")
    exit()

try:
    with open("FilteredDataHuman.json", "r") as file:  # Ensure the file name is correct
        data = json.load(file)
        print("JSON file loaded successfully.")
except FileNotFoundError:
    print("Error: JSON file not found.")
    exit()
except json.JSONDecodeError:
    print("Error: Failed to decode JSON.")
    exit()

for record in data:
    try:
        timestamp = record["timestamp"]["$date"]["$numberLong"]

        for instance_id, instance in record["instances"].items():
            pos_x = instance["pos_x"]
            pos_y = instance["pos_y"]
            vel_x = instance["vel_x"]
            vel_y = instance["vel_y"]
            confidence = instance["confidence"]

            query = """
            INSERT INTO data (instance_id, pos_x, pos_y, velocity_x, velocity_y, confidence, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            values = (int(instance_id), pos_x, pos_y, vel_x, vel_y, confidence, int(timestamp))

            print(f"Executing query: {query}")
            print(f"With values: {values}")

            cursor.execute(query, values)

    except KeyError as e:
        print(f"Error: Missing key {e} in record. Skipping this record: {record}")
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        db.rollback() 

db.commit()
print(f"{cursor.rowcount} rows inserted successfully.")

cursor.close()
db.close()


## Getting Started
1. **Clone the Repository**:
  ```bash
   git clone https://github.com/Mohib997/real-time-data-visualization.git

1. Navigate to the Project Directory:
  ```bash
    cd real-time-data-visualization

2. Install Dependencies:
  ```bash
    npm install

3. Run the Backend Server:
  ```bash
    node index.js

4. Run the Frontend Application:
  ```bash
    cd frontend
    npm start

