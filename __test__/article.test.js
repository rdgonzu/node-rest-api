const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let testServer;

beforeAll(() => {

    mongoose.set('useFindAndModify', false);
    mongoose.Promise = global.Promise;

    mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        testServer = app.listen(4000);
    });

});

afterAll((done) => {
    testServer.close(done);
    mongoose.connection.close();
});

describe('GET /api/articles/:limit?', () => {

    test('Should return article list.', async () => {
        
        const response = await request(app).get('/api/articles/1');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');

    });

});