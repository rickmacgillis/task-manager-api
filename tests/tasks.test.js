const request = require('supertest');
const app = require('../src/app.js');
const Task = require('../src/models/task.js');
const { userOne, userTwo, taskOne, taskTwo, setupDatabase } = require('./fixtures/db.js');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Test task',
        })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();

    expect(task.completed).toBe(false);

});

test('Should not create task for user with invalid description', async () => {
    
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: '',
        })
        .expect(422);

});

test('Should not create task for user with invalid completion status', async () => {
    
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'wrong',
        })
        .expect(422);

});

test('Should retrieve only tasks for current user', async () => {

    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response).not.toBeNull();
    expect(response.body.length).toBe(2);

});

test('Should retrieve only completed tasks for current user', async () => {

    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response).not.toBeNull();
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(taskTwo.description);

});

test('Should retrieve only incomplete tasks for current user', async () => {

    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response).not.toBeNull();
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(taskOne.description);

});

test('Should sort tasks by decription', async () => {

    // ASC
    const responseAsc = await request(app)
        .get('/tasks?sortBy=description_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(responseAsc).not.toBeNull();
    expect(responseAsc.body.length).toBe(2);
    expect(responseAsc.body[0].description).toBe(taskOne.description);
    expect(responseAsc.body[1].description).toBe(taskTwo.description);

    // DESC
    const responseDesc = await request(app)
        .get('/tasks?sortBy=description_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(responseDesc).not.toBeNull();
    expect(responseDesc.body.length).toBe(2);
    expect(responseDesc.body[1].description).toBe(taskOne.description);
    expect(responseDesc.body[0].description).toBe(taskTwo.description);

});

test('Should sort tasks by completion status', async () => {

    // ASC
    const responseAsc = await request(app)
        .get('/tasks?sortBy=completed_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(responseAsc).not.toBeNull();
    expect(responseAsc.body.length).toBe(2);
    expect(responseAsc.body[0].description).toBe(taskOne.description);
    expect(responseAsc.body[1].description).toBe(taskTwo.description);

    // DESC
    const responseDesc = await request(app)
        .get('/tasks?sortBy=completed_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(responseDesc).not.toBeNull();
    expect(responseDesc.body.length).toBe(2);
    expect(responseDesc.body[1].description).toBe(taskOne.description);
    expect(responseDesc.body[0].description).toBe(taskTwo.description);

});

test('Should sort tasks by createdAt', async () => {

    // ASC
    const responseAsc = await request(app)
        .get('/tasks?sortBy=createdAt_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(responseAsc).not.toBeNull();
    expect(responseAsc.body.length).toBe(2);
    expect(responseAsc.body[0].description).toBe(taskOne.description);
    expect(responseAsc.body[1].description).toBe(taskTwo.description);

    // DESC
    const responseDesc = await request(app)
        .get('/tasks?sortBy=createdAt_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(responseDesc).not.toBeNull();
    expect(responseDesc.body.length).toBe(2);
    expect(responseDesc.body[1].description).toBe(taskOne.description);
    expect(responseDesc.body[0].description).toBe(taskTwo.description);

});

test('Should sort tasks by updatedAt', async () => {

    // ASC
    const responseAsc = await request(app)
        .get('/tasks?sortBy=updatedAt_asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(responseAsc).not.toBeNull();
    expect(responseAsc.body.length).toBe(2);
    expect(responseAsc.body[0].description).toBe(taskOne.description);
    expect(responseAsc.body[1].description).toBe(taskTwo.description);

    // DESC
    const responseDesc = await request(app)
        .get('/tasks?sortBy=updatedAt_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(responseDesc).not.toBeNull();
    expect(responseDesc.body.length).toBe(2);
    expect(responseDesc.body[1].description).toBe(taskOne.description);
    expect(responseDesc.body[0].description).toBe(taskTwo.description);

});

test('Should page tasks for current user', async () => {

    // Page 1
    const responsePage1 = await request(app)
        .get('/tasks?limit=1&skip=0')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(responsePage1).not.toBeNull();
    expect(responsePage1.body.length).toBe(1);
    expect(responsePage1.body[0].description).toBe(taskOne.description);

    // Page 2
    const responsePage2 = await request(app)
    .get('/tasks?limit=1&skip=1')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    expect(responsePage2).not.toBeNull();
    expect(responsePage2.body.length).toBe(1);
    expect(responsePage2.body[0].description).toBe(taskTwo.description);

});

test('Should retrieve task for current user', async () => {

    const response = await request(app)
        .get('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response).not.toBeNull();
    expect(response.body.description).toBe(taskOne.description);

});

test('Should not retrieve task for unauthenticated user', async () => {

    await request(app)
        .get('/tasks/' + taskOne._id)
        .send()
        .expect(401);

});

test('Should not retrieve task for a different user', async () => {

    await request(app)
        .get('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

});

test('Should not allow user to delete own tasks', async () => {

    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const task = await Task.findById(taskOne._id);
    expect(task).toBeNull();

});

test('Should not allow unauthenticated user to delete tasks', async () => {

    await request(app)
        .delete('/tasks/' + taskOne._id)
        .send()
        .expect(401);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();

});

test('Should not allow user to delete another user\'s tasks', async () => {

    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();

});

test('Should update task owned by current user', async () => {

    const updatedTaskData = {
        description: 'New Description',
        completed: true,
    };

    const response = await request(app)
        .patch('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(updatedTaskData)
        .expect(200);

    expect(response.body).toMatchObject(updatedTaskData);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();

    expect(task.description).toBe(updatedTaskData.description);
    expect(task.completed).toBe(updatedTaskData.completed);

});

test('Should not update task with invalid description', async () => {

    await request(app)
        .patch('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: '',
        })
        .expect(422);

});

test('Should not update task with invalid completion status', async () => {

    const response = await request(app)
        .patch('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'wrong',
        })
        .expect(422);

});

test('Should not update task owned by another user', async () => {

    const newDescription = 'Change description';
    await request(app)
        .patch('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: newDescription,
        })
        .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task.description).not.toBe(newDescription);

});
