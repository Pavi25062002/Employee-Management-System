import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const statusOptions = ["Pending", "In Progress", "Completed", "On Hold"];

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5500/api/tasks/${id}`).then((res) => {
      console.log(res.data);
      
      setTask(res.data);
      setStatus(res.data.status);
    });
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`http://localhost:5500/api/tasks/${id}/status`, {
        status,
      });
      alert("Status updated successfully");
    } catch (error) {
      alert("Error updating status");
    }
  };

  if (!task) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5 fade-in" style={{ padding: "70px" }}>
      {/* Add this wrapper */}
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow-lg rounded-4 p-4" style={{ maxWidth: "600px", width: "100%" }}>
          <h2 className="mb-3">{task.title}</h2>
          <p className="text-muted">{task.description}</p>
  
          <div className="mb-3">
            <span className="badge bg-primary me-2">Priority: {task.priority}</span>
            <span className="badge bg-info">Status: {task.status}</span>
          </div>
  
          <p><strong>Deadline:</strong> {new Date(task.deadline).toDateString()}</p>
          <p><strong>assignedBy:</strong> {task.assignedBy}</p>
              <p><strong>assignedTo:</strong> {task.assignedTo}</p>
              
  
          {task.extensionRequested?.requested && (
            <div className="alert alert-warning mt-3">
              <h6>Extension Requested</h6>
              <p><strong>New Deadline:</strong> {new Date(task.extensionRequested.newDeadline).toDateString()}</p>
             
              
              <p><strong>Reason:</strong> {task.extensionRequested.reason}</p>
            </div>
          )}
  
          <div className="mt-4">
            <label htmlFor="status" className="form-label"><strong>Update Status</strong></label>
            <select
              id="status"
              className="form-select mb-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button className="btn btn-success w-100" onClick={handleStatusUpdate}>
              Update Status
            </button>
          </div>
        </div>
      </div>
  
      <style>{`
        .fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
  
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
  
};

export default TaskDetails;
