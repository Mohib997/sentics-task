import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import h337 from 'heatmap.js'; // Import heatmap.js

const App = () => {
  const [data, setData] = useState([]); 
  const [option, setOption] = useState('pos_x'); 
  const [duration, setDuration] = useState('last_hour'); 
  const [heatmapData, setHeatmapData] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      const startTime = 1662896470000; // Adjusted to a known valid timestamp in milliseconds
      const endTime = 1662896500000; // Adjusted to a known valid timestamp in milliseconds

      console.log('Fetching data with params:', {
        option,
        startTime,
        endTime,
      });

      try {
        const response = await axios.get('http://localhost:5000/api/data', {
          params: { 
            option, 
            startTime, 
            endTime 
          },
        });

        console.log('Response from API:', response.data); // Log the full response
        setData(response.data); // Set data in state
        console.log('Data set in state:', response.data); // Log data state

        // Prepare heatmap data from API
        const heatmapPoints = response.data.map(item => {
          console.log('Item for heatmap:', item); // Log each item being processed
          const posX = parseFloat(item.average_pos_x); // Ensure these match your SQL aliases
          const posY = parseFloat(item.average_pos_y);
          
          if (isNaN(posX) || isNaN(posY)) {
            console.warn(`Invalid values for heatmap: average_pos_x=${item.average_pos_x}, average_pos_y=${item.average_pos_y}`);
            return null; // Skip this item if values are invalid
          }

          return {
            x: posX.toFixed(2), // Ensure it's a number after formatting
            y: posY.toFixed(2),
            value: 1, // You can adjust this value as needed
          };
        }).filter(point => point !== null); // Filter out any invalid entries

        console.log('Heatmap Data from API:', heatmapPoints); // Log heatmap data
        setHeatmapData(heatmapPoints); // Set heatmap data in state

      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    };

    fetchData();
  }, [option, duration]);

  // Handle option selection
  const handleOptionChange = (e) => {
    setOption(e.target.value); 
  };

  // Handle duration selection
  const handleDurationChange = (e) => {
    setDuration(e.target.value); 
  };

  // Heatmap Initialization
  useEffect(() => {
    if (heatmapData.length > 0) {
      console.log('Heatmap Data Before Initialization:', heatmapData); // Log heatmap data
      const heatmapInstance = h337.create({
        container: document.getElementById('heatmap'), // Specify the container for the heatmap
      });

      heatmapInstance.setData({
        max: Math.max(...heatmapData.map(d => parseFloat(d.value))), // Calculate the maximum value for normalization
        data: heatmapData, // Pass the heatmap data
      });

      console.log('Heatmap initialized with data:', heatmapData);
    } else {
      console.log('No heatmap data available for initialization.');
    }
  }, [heatmapData]); // This effect runs when heatmapData changes

  return (
    <div>
      <h1>Real-Time Data Visualization</h1>
      <div>
        <label>Select Option: </label>
        <select onChange={handleOptionChange}>
          <option value="pos_x">Position X</option>
          <option value="pos_y">Position Y</option>
          <option value="instance_id">Instance ID</option>
        </select>
      </div>

      <div>
        <label>Select Duration: </label>
        <select onChange={handleDurationChange}>
          <option value="last_hour">Last Hour</option>
          <option value="last_day">Last Day</option>
          <option value="last_week">Last Week</option>
        </select>
      </div>

      {/* Plotly.js graph */}
      {data.length > 0 ? (
        <Plot
          data={[{
            x: data.map((d) => new Date(d.timestamp)),  // X-axis: Timestamps
            y: data.map((d) => parseFloat(d.average_pos_x)),  // Y-axis: Average values from the backend
            type: 'scatter',
            mode: 'lines+markers',
          }]}
          layout={{ title: 'Data Graph', xaxis: { title: 'Time' }, yaxis: { title: 'Average Position X' } }}
        />
      ) : (
        <p>No data available for the selected time range.</p>
      )}

      {/* Heatmap Component */}
      <div>
        <h2>Heatmap</h2>
        <div id="heatmap" style={{ width: '600px', height: '400px', border: '1px solid black' }}></div>
      </div>
    </div>
  );
};

export default App;
