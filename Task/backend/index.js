const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234', 
  database: 'real_time_data',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/api/data', (req, res) => {
  const { human_id, x_position, y_position, timestamp } = req.body;
  const query = 'INSERT INTO data (human_id, x_position, y_position, timestamp) VALUES (?, ?, ?, ?)';

  connection.query(query, [human_id, x_position, y_position, timestamp], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting data');
    } else {
      res.status(201).send('Data inserted');
    }
  });
});

app.get('/api/data', (req, res) => {
  const { option, startTime, endTime } = req.query;

  const query = `SELECT AVG(${option}) AS average_value, timestamp 
                 FROM data 
                 WHERE timestamp BETWEEN ? AND ? 
                 GROUP BY timestamp`;

  connection.query(query, [startTime, endTime], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
