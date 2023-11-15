const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../utils/database');
const User = require('../models/user');

describe('User routes', () => {
  beforeAll(async () => {
    // Set up a test database and establish a connection
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    // Clean up test data after each test
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    // Close the database connection after all tests are done
    await sequelize.close();
  });

  describe('GET /', () => {
    it('should return a list of users', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /:id', () => {
    it('should return a single user', async () => {
      const user = await User.create({
        fname: 'John',
        lname: 'Doe',
        email: 'johndoe@example.com',
        password: 'password',
        isAdmin: false
      });

      const res = await request(app).get(`/api/users/${user.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('fname', 'John');
      expect(res.body).toHaveProperty('lname', 'Doe');
      expect(res.body).toHaveProperty('email', 'johndoe@example.com');
      expect(res.body).toHaveProperty('isAdmin', false);
    });

    it('should return a 404 error if user is not found', async () => {
      const res = await request(app).get('/api/users/999');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /', () => {
    it('should create a new user', async () => {
      const user = {
        fname: 'John',
        lname: 'Doe',
        email: 'johndoe@example.com',
        password: 'password'
      };

      const res = await request(app).post('/api/users').send(user);
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual('User created successfully!!');
    });

    it('should return a 400 error if user data is invalid', async () => {
      const user = {
        fname: 'John',
        lname: 'Doe',
        email: 'invalid-email',
        password: 'password'
      };

      const res = await request(app).post('/api/users').send(user);
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a user', async () => {
      const user = await User.create({
        fname: 'John',
        lname: 'Doe',
        email: 'johndoe@example.com',
        password: 'password',
        isAdmin: false
      });

      const res = await request(app).delete(`/api/users/${user.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual('User deleted successfully!!');
    });

    it('should return a 404 error if user is not found', async () => {
      const res = await request(app).delete('/api/users/999');
      expect(res.statusCode).toEqual(404);
    });
  });
});