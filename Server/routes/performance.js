const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance-model');
const Leave = require('../models/leave-model');
const Task = require('../models/task-model');
const userModel = require('../models/user-model');

const getWorkingDaysInMonth = (month, year) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    let count = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) count++;
    }
    return count;
};

router.get('/:employeeID/:month/:year', async (req, res) => {
    try {
        const { employeeID, month, year } = req.params;
       const user= await  userModel.find({email:employeeID})
        const parsedMonth = parseInt(month);
        const totalDays = getWorkingDaysInMonth(parsedMonth, year);

        const presentDays = await Attendance.countDocuments({
            employeeID:user[0]._id,
            month: parsedMonth,
            year,
            present: true
        });

        const startOfMonth = new Date(year, parsedMonth - 1, 1);
        const endOfMonth = new Date(year, parsedMonth, 0, 23, 59, 59);

        const leaves = await Leave.find({
            applicantID: user[0]._id,
            $or: [
                { startDate: { $gte: startOfMonth, $lte: endOfMonth } },
                { endDate: { $gte: startOfMonth, $lte: endOfMonth } }
            ]
        });

        const tasks = await Task.find({ assignedTo: user[0]._id });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === "Completed").length;
        const onTimeTasks = tasks.filter(t =>
            t.status === "Completed" && new Date(t.deadline) >= new Date(t.updatedAt)
        ).length;

        const attendanceScore = (presentDays / totalDays) * 25;
        const leaveScore = Math.max(0, (10 - leaves.length)) * 2.5;
        const taskScore = totalTasks > 0
            ? ((completedTasks / totalTasks) * 25 + (onTimeTasks / totalTasks) * 10)
            : 0;
        const teamParticipationScore = 10;
        const totalScore = attendanceScore + leaveScore + taskScore + teamParticipationScore;

        res.json({
            attendanceScore: attendanceScore.toFixed(2),
            leaveScore: leaveScore.toFixed(2),
            taskScore: taskScore.toFixed(2),
            teamParticipationScore,
            totalScore: totalScore.toFixed(2)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong." });
    }
});

module.exports = router;
