// createTask.js
const Task = require('../models/task-model');

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// updateTaskStatus.js
exports.updateTaskStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
// requestExtension.js
exports.requestExtension = async (req, res) => {
    try {
      const { newDeadline, reason } = req.body;
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        {
          extensionRequested: {
            requested: true,
            newDeadline,
            reason
          },
          status: 'Extension Requested'
        },
        { new: true }
      );
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };


  // updateTaskStatus.js
exports.Getalltasks = async (req, res) => {
    try {
      const task = await Task.find();
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  exports.Gettasksbyid = async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskid);
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
    