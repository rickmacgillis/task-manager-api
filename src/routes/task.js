const express = require('express');
const Task = require('../models/task.js');
const auth = require('../middleware/auth.js');
const router = express.Router();

router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });

    try {

        await task.save();
        res.status(201).send(task);

    } catch (error) {
        res.status(422).send(error);
    }

});

router.get('/tasks', auth, async (req, res) => {

    const match = {};
    const sort = {};

    if (req.query.completed !== undefined) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy !== undefined) {
        
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;

    }

    try {

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },
        }).execPopulate();

        res.send(req.user.tasks);

    } catch (error) {
        res.status(500).send();
    }

});

router.get('/tasks/:id', auth, async (req, res) => {

    const taskId = req.params.id;

    try {

        const task = await Task.findOne({
            _id: taskId,
            owner: req.user._id
        });

        if (task === null) {
            return res.status(404).send();
        }

        res.send(task);

    } catch (error) {
        res.status(500).send();
    }

});

router.patch('/tasks/:id', auth, async (req, res) => {

    const taskId = req.params.id;
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (isValidOperation === false) {
        return res.status(422).send({ error: 'Invalid operation' });
    }

    try {

        const task = await Task.findOne({
            _id: taskId,
            owner: req.user._id,
        });

        if (task === null) {
            return res.status(404).send();
        }
        
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);

    } catch (error) {
        res.status(422).send(error);
    }

});

router.delete('/tasks/:id', auth, async (req, res) => {

    const taskId = req.params.id;

    try {

        const deletedTask = await Task.findOneAndDelete({
            _id: taskId,
            owner: req.user._id,
        });
        
        if (deletedTask === null) {
            return res.status(404).send();
        }

        res.send(deletedTask);

    } catch (error) {
        res.status(500).send(error);
    }

});

module.exports = router;
