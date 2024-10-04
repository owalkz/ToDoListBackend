const Mongoose = require('mongoose');

const taskSchema = Mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
});

module.exports = Mongoose.model('Task', taskSchema);