const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',  // MySQL password
  database: 'real_time_data',  // Database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/api/data', (req, res) => {
  const { option, startTime, endTime } = req.query;

  const validOptions = ['pos_x', 'pos_y', 'instance_id'];
  
  if (!validOptions.includes(option)) {
    return res.status(400).send('Invalid option');
  }

  const query = `
    SELECT AVG(pos_x) AS average_pos_x, 
           AVG(pos_y) AS average_pos_y, 
           timestamp 
    FROM data 
    WHERE timestamp BETWEEN ? AND ? 
    GROUP BY timestamp;
  `;

  console.log('Query:', query); 
  console.log('Parameters:', [startTime, endTime]); 

  connection.query(query, [startTime, endTime], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err); 
      return res.status(500).send('Error fetching data');
    } else {
      console.log('Results:', results); 
      res.json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
