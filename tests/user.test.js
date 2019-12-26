const request = require('supertest');

const app = require('../src/app.js');
const User = require('../src/models/user.js');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db.js');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {

    const newUser = {
        name: 'Rick',
        email: 'rick@example.com',
        password: 'VzcQQ*JqL3^26CmD',
    };

    const response = await request(app)
        .post('/users')
        .send(newUser)
        .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: newUser.name,
            email: newUser.email,
        },
        token: user.tokens[0].token,
    });

    expect(user.password).not.toBe(newUser.password);

});

test('Should not signup user with invalid email', async () => {

    await request(app)
        .post('/users')
        .send({
            name: 'Rick',
            email: 'badEmail',
            password: 'VzcQQ*JqL3^26CmD',
        })
        .expect(422);

});

test('Should not signup user with invalid name', async () => {

    await request(app)
        .post('/users')
        .send({
            name: '',
            email: 'rick@example.com',
            password: 'VzcQQ*JqL3^26CmD',
        })
        .expect(422);

});

test('Should not signup user with invalid password', async () => {

    await request(app)
        .post('/users')
        .send({
            name: 'Rick',
            email: 'rick@example.com',
            password: 'password',
        })
        .expect(422);


    await request(app)
        .post('/users')
        .send({
            name: 'Rick',
            email: 'rick@example.com',
            password: '123456',
        })
        .expect(422);

});

test('Should login existing user', async () => {

    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password,
        }).expect(200);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body.token).toBe(user.tokens[1].token);

});

test('Should not login nonexistent user', async () => {

    await request(app)
        .post('/users/login')
        .send({
            email: 'fake@example.com',
            password: 'fakepass',
        }).expect(401);

});

test('Should get profile for user', async () => {

    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

});

test('Should not get profile for unauthenticated user', async () => {

    await request(app)
        .get('/users/me')
        .send()
        .expect(401);

});

test('Should delete account for user', async () => {

    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();

});

test('Should not delete account for unauthenticated user', async () => {

    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);

});

test('Should upload avatar image', async () => {

    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));

});

test('Should update valid user fields', async () => {

    const newName = 'My Name';
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: newName,
        })
        .expect(200);

    expect(response).not.toBeNull();
    expect(response.body.name).toBe(newName);

    const user = await User.findById(userOneId);
    expect(user.name).toBe(newName);

});

test('Should not update invalid user fields', async () => {

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Test',
        })
        .expect(422);

});

test('Should update unauthenticated user profile', async () => {

    await request(app)
        .patch('/users/me')
        .send({
            name: 'My Name',
        })
        .expect(401);

});

test('Should not update user profile with invalid name', async () => {

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: '',
        })
        .expect(422);

});

test('Should not update user profile with invalid email', async () => {

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'badEmail',
        })
        .expect(422);

});

test('Should not update user profile with invalid password', async () => {

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: 'password',
        })
        .expect(422);

    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: '123456',
        })
        .expect(422);

});
