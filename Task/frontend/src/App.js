import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import heatmap from 'heatmap.js';

const App = () => {
  const [data, setData] = useState([]); 
  const [option, setOption] = useState('x_position'); 
  const [duration, setDuration] = useState('last_hour'); 
  const [heatmapInstance, setHeatmapInstance] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data', {
          params: { 
            option, 
            startTime: getStartTime(duration), 
            endTime: Date.now() 
          },
        });
        setData(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    };
    fetchData();
  }, [option, duration]); 
  const handleOptionChange = (e) => {
    setOption(e.target.value); 
    updateHeatmap(); 
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value); 
  };

  const getStartTime = (duration) => {
    const now = Date.now();
    switch (duration) {
      case 'last_hour':
        return now - 3600000; 
      case 'last_day':
        return now - 86400000; 
      case 'last_week':
        return now - 604800000; 
      default:
        return 0;
    }
  };

  const updateHeatmap = () => {
    if (heatmapInstance) {
      const heatmapData = data.map((d) => ({
        x: d.x_position, 
        y: d.y_position, 
        value: d[option], 
      }));
      heatmapInstance.setData({
        max: Math.max(...heatmapData.map(d => d.value)), 
        data: heatmapData,
      });
    }
  };

  useEffect(() => {
    const heatmapInstance = heatmap.create({
      container: document.getElementById('heatmap'), 
    });
    setHeatmapInstance(heatmapInstance);
    updateHeatmap(); 
  }, [data]); 

  return (
    <div>
      <h1>Real-Time Data Visualization</h1>
      <div>
        <label>Select Option: </label>
        <select onChange={handleOptionChange}>
          <option value="x_position">X Position</option>
          <option value="y_position">Y Position</option>
          <option value="human_id">Number of Humans</option>
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
      <Plot
        data={[
          {
            x: data.map((d) => new Date(d.timestamp)), 
            y: data.map((d) => d.average_value), 
            type: 'scatter',
            mode: 'lines+markers',
          },
        ]}
        layout={{ title: 'Data Graph', xaxis: { title: 'Time' }, yaxis: { title: option } }}
      />

      {/* Heatmap Component */}
      <div id="heatmap" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default App;
