const express = require('express');

const apiMiddleware = (app) => {
    const idGenerator = {
        _prevId: 0,
        generate() {
            return (++this._prevId).toString();
        },
    };

    const tasks = [
        {
            isComplete: false,
            body: 'Create awesome app!',
            id: idGenerator.generate(),
        },
    ];

    app.use(express.json());

    app.get('/api/tasks', (_, res) => {
        res.json(tasks);
    });

    app.get('/api/tasks/:id', (req, res) => {
        const task = tasks.find((it) => it.id === req.params.id);
        res.json(task);
    });

    app.post('/api/tasks', (req, res) => {
        const newTask = {
            isComplete: false,
            ...req.body,
            id: idGenerator.generate(),
        };
        tasks.push(newTask);
        res.json(newTask);
    });

    app.put('/api/tasks', (req, res) => {
        const newTask = req.body;
        const taskIndex = tasks.findIndex((it) => it.id === newTask.id);
        const isExist = taskIndex !== -1;
        if (isExist) {
            const oldTask = tasks[taskIndex];
            tasks[taskIndex] = {
                ...oldTask,
                ...newTask,
            };
        }
        res.json(tasks[taskIndex]);
    });

    app.delete('/api/tasks/:id', (req, res) => {
        const taskIndex = tasks.findIndex((it) => it.id === req.params.id);
        const isExist = taskIndex !== -1;
        if (isExist) {
            const [deleteTask] = tasks.splice(taskIndex, 1);
            res.json(deleteTask);
        }
        res.json(null);
    });
};

module.exports = {
    apiMiddleware,
};
