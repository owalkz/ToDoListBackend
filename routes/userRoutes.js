const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddelware');
const {
    viewTask,
    viewTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/userController');

router.get('/task/:id', protect, viewTask);
router.get('/tasks', protect, viewTasks);
router.post('/create', protect, createTask);
router.put('/update/:id', protect, updateTask);
router.delete('/delete/:id', protect, deleteTask);

module.exports = router;