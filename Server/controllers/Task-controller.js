// createTask.js
const Task = require('../models/task-model');
const userModel = require('../models/user-model');
const { sendTaskAssignedMail, sendTaskCompletedMail, sendExtensionRequestMail } = require('../services/mail-service');

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();

    const userData=await userModel.find({email:task.assignedTo})

    await sendTaskAssignedMail(userData[0].name,task.assignedTo,task.title,task.deadline,task.priority)
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// updateTaskStatus.js
exports.updateTaskStatus = async (req, res) => {
    try {
      console.log(req.body);
      
      const { status } = req.body;
      const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
      
      const userData=await userModel.find({email:task.assignedBy})
      
      if (status==="Completed" ) {
        console.log(userData[0]);
        
        await  sendTaskCompletedMail(userData[0].name,task.assignedTo,task.title,task.assignedTo)
        
      }
      res.json(task);


    } catch (err) {
      console.log(err);
      
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

        const userData=await userModel.find({email:task.assignedBy})

      console.log(userData);
      

   await   sendExtensionRequestMail(userData[0].name,userData[0].email,task.assignedTo,newDeadline)

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
    
  exports.Gettasksbyownid = async (req, res) => {

    try {
      const task = await Task.find({assignedTo:req.params.email});
      console.log(task);
      
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };



  
    


