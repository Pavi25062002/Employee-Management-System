import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

// ✅ Static User List
const staticUsers = [
  { _id: '6613be2a354a0aeb8f23d101', name: 'Alice' },
  { _id: '6613be2a354a0aeb8f23d102', name: 'Bob' },
  { _id: '6613be2a354a0aeb8f23d103', name: 'Charlie' }
];

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Pending', 'In Progress', 'Completed', 'Extension Requested'];

const CreateTask = () => {
  const users = staticUsers;

  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    assignedBy: '',
    assignedTo: [],
    deadline: '',
    extensionRequested: {
      requested: false,
      newDeadline: '',
      reason: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('extensionRequested.')) {
      const key = name.split('.')[1];
      setTask((prev) => ({
        ...prev,
        extensionRequested: {
          ...prev.extensionRequested,
          [key]: value
        }
      }));
    } else {
      setTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAssignedToChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setTask((prev) => ({ ...prev, assignedTo: selected }));
  };

  const toggleExtensionRequest = () => {
    setTask((prev) => ({
      ...prev,
      extensionRequested: {
        ...prev.extensionRequested,
        requested: !prev.extensionRequested.requested
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5500/api/tasks', task);
      swal("Success", "Task Created Successfully!", "success");
    } catch (error) {
      console.error(error);
      swal("Error", "Failed to create task", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" name="title" className="form-control" required value={task.title} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" rows="3" value={task.description} onChange={handleChange}></textarea>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Priority</label>
            <select className="form-select" name="priority" value={task.priority} onChange={handleChange}>
              {priorities.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" value={task.status} onChange={handleChange}>
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Assigned By</label>
          <select className="form-select" name="assignedBy" value={task.assignedBy} onChange={handleChange}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Assigned To (Multiple)</label>
          <select multiple className="form-select" value={task.assignedTo} onChange={handleAssignedToChange}>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input type="date" name="deadline" className="form-control" value={task.deadline} onChange={handleChange} />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={task.extensionRequested.requested}
            onChange={toggleExtensionRequest}
            id="extensionRequestCheck"
          />
          <label className="form-check-label" htmlFor="extensionRequestCheck">
            Request Extension
          </label>
        </div>

        {task.extensionRequested.requested && (
          <>
            <div className="mb-3">
              <label className="form-label">New Deadline</label>
              <input
                type="date"
                name="extensionRequested.newDeadline"
                className="form-control"
                value={task.extensionRequested.newDeadline}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Reason</label>
              <textarea
                name="extensionRequested.reason"
                className="form-control"
                rows="2"
                value={task.extensionRequested.reason}
                onChange={handleChange}
              ></textarea>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;
