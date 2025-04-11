import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { getAdmins, getLeaders } from '../../http';

const staticUsers = [
  { _id: '6613be2a354a0aeb8f23d101', name: 'Alice' },
  { _id: '6613be2a354a0aeb8f23d102', name: 'Bob' },
  { _id: '6613be2a354a0aeb8f23d103', name: 'Charlie' }
];

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Pending', 'In Progress', 'Completed', 'Extension Requested'];

const CreateTask = () => {
  const [users, setUsers] = useState();
  const [admins, setadmins] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadersRes, adminsRes] = await Promise.all([getLeaders(), getAdmins()]);
        if (leadersRes.success) setUsers(leadersRes.data);
        if (adminsRes.success) setadmins(adminsRes.data);
      } catch (err) {
        console.error('Error fetching users/admins', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    assignedBy: '',
    assignedTo: '',
    deadline: '',
    extensionRequested: {
      requested: false,
      newDeadline: '',
      reason: ''
    }
  });

  useEffect(() => {
    console.log('Task State:', task);
  }, [task]);

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

   const user= users.filter(user=>user.name===e.target.value)
   console.log(user[0]);
   
    setTask((prev) => ({
      ...prev,
      assignedTo: e.target.value
    }));
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
    console.log('Submitting Task:', JSON.stringify(task, null, 2));

    try {
      await axios.post('http://localhost:5500/api/tasks', task);
      swal("Success", "Task Created Successfully!", "success");
    } catch (error) {
      console.error(error);
      swal("Error", "Failed to create task", "error");
    }
  };

  return (
    <div className="d-flex justify-content-center">
  <div className="container mt-4">
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
            {admins?.map((user) => (
              <option key={user?.email} value={user?.email}>{user?.email}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Assigned To</label>
          <select
            className="form-select"
            name="assignedTo"
            value={task.assignedTo}
            onChange={handleAssignedToChange}
          >
            <option value="">Select User</option>
            {users?.map((user) => (
              <option key={user?.email} value={user?.email}>{user?.email}</option>
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
    </div>
    </div>  
  );
};

export default CreateTask;
