const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Extension Requested'], default: 'Pending' },
    assignedBy: { type: String, ref: 'User', required: true },
    assignedTo: { type: String, ref: 'User', required: true },
    deadline: { type: Date, required: true },
    comments: [{
        commenter: { type: Schema.Types.ObjectId, ref: 'User' },
        text: String,
        timestamp: { type: Date, default: Date.now }
    }],
    progressUpdates: [{
        text: String,
        timestamp: { type: Date, default: Date.now }
    }],
    extensionRequested: {
        requested: { type: Boolean, default: false },
        newDeadline: { type: Date },
        reason: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
