const express = require('express');
const router = express.Router();
const { createTask, updateTaskStatus, requestExtension, Getalltasks, Gettasksbyid, Gettasksbyownid } = require('../controllers/Task-controller');

router.post('/tasks', createTask);
router.put('/tasks/:id/status', updateTaskStatus);
router.post('/tasks/:id/extension', requestExtension);
router.get('/tasks',Getalltasks);
router.get('/tasks/:taskid',Gettasksbyid);
router.get('/tasks/mytask/:email',Gettasksbyownid);
module.exports = router;
