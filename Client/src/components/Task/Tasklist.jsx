import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

toast.configure();

const TaskList = () => {

  const history=useHistory() 

 

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5500/api/tasks');
      setTasks(res.data);
    } catch (error) {
      toast.error('⚠️ Failed to load tasks!');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📋 Task Management Dashboard</h2>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="🔍 Search by title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Extension Requested">Extension Requested</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Task Cards */}
      <div className="row">
        {filteredTasks.length === 0 ? (
          <div className="col-12 text-center text-muted">😕 No matching tasks found.</div>
        ) : (
          filteredTasks.map((task) => (
            <div className="col-md-6 col-lg-4 mb-4" key={task._id}>
              <div className="card shadow-sm h-100 border-0 hover-shadow">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{task.title}</h5>
                  <p className="card-text text-muted">{task.description || 'No description provided'}</p>

                  <div className="mb-2">
                    <span className={`badge me-2 bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}`}>
                      {task.priority}
                    </span>
                    <span className={`badge bg-${task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'info' : 'secondary'}`}>
                      {task.status}
                    </span>
                  </div>

                  <p className="mb-1"><strong>Deadline:</strong> {moment(task.deadline).format('MMM DD, YYYY')}</p>
                  <p className="mb-1"><strong>Assigned By:</strong> {task.assignedBy?.name || 'User ID'}</p>
                  <p className="mb-1"><strong>Assigned To:</strong> {task.assignedTo?.name || 'User ID'}</p>

                  <div className="mt-auto d-flex justify-content-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={()=> history.push(`/tasklist/${task._id}`)}>View</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
