import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { useSelector } from 'react-redux';
import { right } from '@popperjs/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

toast.configure();

const OwnTaskList = () => {

    const history = useHistory()

    const admin = "/team-creatask/"
    // const user=JSON.parse(localStorage.getItem("user"))
    const { user } = useSelector(state => state.authSlice);
    const role = user.type


    console.log(role);


    const navigate = (id) => {

        if (role == "Leader") {
            history.push(admin + id)
        } else {
            history.push(`/tasklist/${id}`)
        }

    }


    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredTasks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
        XLSX.writeFile(workbook, 'MyTasks.xlsx');
      };
      
      const exportToPDF = () => {
        const doc = new jsPDF();
        let x = 10, y = 10;
        const boxWidth = 180;
        const boxHeight = 60;
        const gap = 10;
      
        filteredTasks.forEach((task, index) => {
          if (y + boxHeight > 280) {
            doc.addPage();
            y = 10;
          }
      
          doc.setDrawColor(0);
          doc.setFillColor(240, 240, 240);
          doc.rect(x, y, boxWidth, boxHeight, 'FD');
      
          doc.setFontSize(12);
          doc.setTextColor(40, 40, 40);
          doc.text(`${task.title}`, x + 5, y + 10);
          doc.setFontSize(10);
          doc.text(` ${task.description}`, x + 5, y + 20);
          doc.text(` Deadline: ${moment(task.deadline).format('MMM DD, YYYY')}`, x + 5, y + 30);
          doc.text(` Status: ${task.status}`, x + 5, y + 38);
          doc.text(` Priority: ${task.priority}`, x + 5, y + 45);
          doc.text(` Assigned By: ${task.assignedBy}`, x + 5, y + 52);
      
          y += boxHeight + gap;
        });
      
        doc.save('MyTasks.pdf');
      };

    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5500/api/tasks/mytask/' + user.email);
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
        <div className="container mt-7" >
            <h2 className="text-center mb-4">📋 Task Management Dashboard</h2>

            {/* Filters */}
            <div className="row g-3 mb-4">
                <div className="mb-3 d-flex justify-content-end gap-2">
                    <button className="btn btn-success" onClick={exportToExcel}>Export to Excel</button>
                    <button className="btn btn-danger" onClick={exportToPDF}>Export to PDF</button>
                </div>

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
                                    <p className="mb-1"><strong>Assigned By:</strong> {task.assignedBy || 'User ID'}</p>
                                    <p className="mb-1"><strong>Assigned To:</strong> {task.assignedTo || 'User ID'}</p>

                                    <div className="mt-auto d-flex justify-content-end">
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => navigate(task._id)}>View</button>
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

export default OwnTaskList;
