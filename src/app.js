const express = require('express');
require('./db/mongoose.js');
const userRoutes = require('./routes/user.js');
const taskRoutes = require('./routes/task.js');

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

module.exports = app;
