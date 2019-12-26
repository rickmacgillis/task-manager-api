const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/user.js');
const Task = require('../../src/models/task.js');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 's*EVwC4PW7J@lQ83',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    }],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: '5sWX1md9oD3ES%j7',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    }],
};

const taskOne = {
    _id: mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOneId,
};

const taskTwo = {
    _id: mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOneId,
};

const taskThree = {
    _id: mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwoId,
};

const setupDatabase = async () => {

    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();

    await Task.deleteMany();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();

};

module.exports = {
    setupDatabase,
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
};
