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
    with open("FilteredDataHuman.json", "r") as file:  # Make sure the file name is correct
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
