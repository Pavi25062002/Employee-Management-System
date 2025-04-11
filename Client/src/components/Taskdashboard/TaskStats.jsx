// TaskStatusChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TaskStatusChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const chartInstance = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: 'Tasks',
          data: Object.values(data),
          backgroundColor: ['#f0ad4e', '#5bc0de', '#5cb85c', '#d9534f'],
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      }
    });

    return () => chartInstance.destroy();
  }, [data]);

  return <canvas ref={canvasRef} />;
};

export default TaskStatusChart;
