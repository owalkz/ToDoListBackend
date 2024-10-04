const User = require("../models/userModel");
const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");

// Description: View a single task
// Route: GET /api/tasks/view
// Access: Private
const viewTask = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const task = await Task.findById(task_id);
  if (task && task.user.toString() === req.user._id.toString()) {
    res.status(200).json({
      _id: task._id,
      title: task.title,
      deadline: task.deadline,
      status: task.status,
    });
  } else {
    res.status(404);
    throw new Error("Task not found");
  }
});

// Description: View all tasks for a particular user
// Route: GET api/tasks/
// Access: Private
const viewTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  if (tasks) {
    res.status(200).json(tasks);
  } else {
    res.status(404);
    throw new Error("No tasks found");
  }
});

// Description: Create a new task
// Route: POST /api/tasks/create
// Access: Private
const createTask = asyncHandler(async (req, res) => {
  const { title, deadline } = req.body;
  if (!title || !deadline) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  const task = await Task.create({
    title,
    deadline,
    status: "pending",
    user: req.user._id,
  });
  if (task) {
    res.status(201).json({
      _id: task._id,
      title: task.title,
      deadline: task.deadline,
      status: task.status,
      user: task.user,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create task");
  }
});

// Description: Update a task
// Route: PUT /api/tasks/update
// Access: Private
const updateTask = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const { title, deadline, status } = req.body;
  const task = await Task.findById(task_id);
  if (task && task.user.toString() === req.user._id.toString()) {
    const updateTask = {
      $set: {
        title: title || task.title,
        deadline: deadline || task.deadline,
        status: status || task.status,
      },
    };
    const updatedTask = await Task.updateOne({ _id: task_id }, updateTask);
    if (updatedTask.nModified === 0) {
      return res.status(400).json({ message: "Task not updated" });
    }
    res.status(200).json({ message: "Task updated successfully" });
  } else if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
});

// Description: Delete a task
// Route: DELETE /api/tasks/delete
// Access: Private
const deleteTask = asyncHandler(async (req, res) => {
  const task_id = req.params.id;
  const task = await Task.findById(task_id);
  // Check if the task exists and belongs to the user making the request
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "User not authorized" });
  }

  // Delete the task
  await Task.deleteOne({ _id: task_id });

  res.status(200).json({ message: "Task deleted successfully" });
});

module.exports = {
  viewTask,
  viewTasks,
  createTask,
  updateTask,
  deleteTask,
};
