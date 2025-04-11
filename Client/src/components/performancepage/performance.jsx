import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PerformancePage = () => {
    const [employeeID, setEmployeeID] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [data, setData] = useState(null);
    const chartRef = useRef(null);
    const myChartRef = useRef(null);

    const handleFetch = async () => {
        try {
            const res = await axios.get(`http://localhost:5500/api/performance/${employeeID}/${month}/${year}`);
            setData(res.data);
        } catch (err) {
            alert('Error fetching data');
        }
    };

    // Inside the component (add these two functions)
    const exportAsImage = async () => {
        const canvas = chartRef.current;
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'performance_chart.png';
        link.click();
    };

    const exportAsPDF = async () => {
        const canvasEl = chartRef.current;
        const canvasImage = canvasEl.toDataURL('image/png');

        const pdf = new jsPDF();
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvasEl.height / canvasEl.width) * width;

        pdf.addImage(canvasImage, 'PNG', 10, 10, width - 20, height);
        pdf.save('performance_chart.pdf');
    };

    useEffect(() => {
        if (data && chartRef.current) {
            if (myChartRef.current) {
                myChartRef.current.destroy(); // Destroy old chart before drawing a new one
            }

            myChartRef.current = new Chart(chartRef.current, {
                type: 'doughnut',
                data: {
                    labels: ['Attendance', 'Leave', 'Tasks', 'Team'],
                    datasets: [
                        {
                            data: [
                                data.attendanceScore,
                                data.leaveScore,
                                data.taskScore,
                                data.teamParticipationScore
                            ],
                            backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        tooltip: {
                            enabled: true,
                        },
                    },
                },
            });
        }
    }, [data]);

    return (
        <div className="container my-5">
            <div className="card shadow-lg rounded-4">
                <div className="card-body p-4">
                    <h3 className="card-title text-center mb-4 text-primary">Performance Evaluation</h3>

                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <label className="form-label">Employee ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={employeeID}
                                onChange={(e) => setEmployeeID(e.target.value)}
                                placeholder="Enter Employee ID"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Month (1-12)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                placeholder="MM"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Year</label>
                            <input
                                type="number"
                                className="form-control"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="YYYY"
                            />
                        </div>
                    </div>

                    <div className="text-center">
                        <button className="btn btn-primary px-5" onClick={handleFetch}>Evaluate</button>
                    </div>

                    {data && (
                        <div className="mt-5">
                            <h5 className="text-success mb-3">Score Breakdown</h5>
                            <ul className="list-group mb-4">
                                <li className="list-group-item">Attendance Score: <b>{data.attendanceScore}</b></li>
                                <li className="list-group-item">Leave Score: <b>{data.leaveScore}</b></li>
                                <li className="list-group-item">Task Score: <b>{data.taskScore}</b></li>
                                <li className="list-group-item">Team Participation: <b>{data.teamParticipationScore}</b></li>
                                <li className="list-group-item bg-light fw-bold">Total Score: {data.totalScore}</li>
                            </ul>
                            <div className="text-center">
                                <canvas ref={chartRef} width="400" height="300" className="mb-4"></canvas>
                                <button className="btn btn-outline-primary me-2" onClick={exportAsImage}>Download PNG</button>
                                <button className="btn btn-outline-danger" onClick={exportAsPDF}>Download PDF</button>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerformancePage;
