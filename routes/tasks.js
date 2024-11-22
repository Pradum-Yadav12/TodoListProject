const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// View all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render('index', { tasks });
    } catch (err) {
        res.status(500).send("Error retrieving tasks.");
    }
});

// Add a task form
router.get('/add', (req, res) => {
    res.render('add');
});

// Create a task
router.post('/add', async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) throw new Error("Task title is required!");
        await Task.create({ title, description });
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Edit task form
router.get('/edit/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.render('edit', { task });
    } catch (err) {
        res.status(404).send("Task not found.");
    }
});

// Update a task
router.post('/edit/:id', async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const task = await Task.findById(req.params.id);

        if (task.completed && completed === "true") {
            throw new Error("Task is already marked as completed!");
        }

        await Task.findByIdAndUpdate(req.params.id, { title, description, completed: completed === "true" });
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete a task
router.get('/delete/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Error deleting task.");
    }
});

module.exports = router;
