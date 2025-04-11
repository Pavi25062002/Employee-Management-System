import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskStatusChart from './TaskStats';
// import TaskStatusChart from './TaskStats'; // Uncomment if chart component is ready

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5500/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const bgColors = {
    "Pending": "bg-warning text-dark",
    "In Progress": "bg-info text-white",
    "Completed": "bg-success text-white",
    "Extension Requested": "bg-danger text-white"
  };

  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const totalTasks = tasks.length;

  return (
    <div className="container py-2">
      <br />     <br />     <br />
      <div className="row g-3">
        {/* Status Cards */}
        {["Pending", "In Progress", "Completed", "Extension Requested"].map((status, i) => (
          <div className="col-12 col-md-3" key={i}>
            <div className={`card shadow-sm h-100 ${bgColors[status]}` }>
              <div className="card-body text-center">
                <h6 className="text-muted">{status}</h6>
                <h4 className="text-primary">{statusCounts[status] || 0}</h4>
              </div>
            </div>
          </div>
        ))}

        {/* Chart Section */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">Task Status Overview</h6>
           <div style={{width:"300px",height:"400px"}}>   <TaskStatusChart data={statusCounts} /></div>
              <p className="text-muted">Chart will be displayed here.</p>
            </div>
          </div>
        </div>

        {/* Deadlines Section */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">Upcoming Deadlines & Performance</h6>
              <div className="row g-3">
                {tasks.slice(0, 5).map(task => (
                  <div className="col-12 col-md-6" key={task._id}>
                    <div className="border rounded p-3 h-100">
                      <h6 className="fw-bold">{task.title}</h6>
                      <p className="mb-1">Assigned To: {task.assignedTo}</p>
                      <p className="mb-1">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                      <p className="text-primary mb-0">Status: {task.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskDashboard;
