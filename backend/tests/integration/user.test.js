const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const fs = require('fs');

setupTestDB();

describe('Movie routers', () => {

    const example = fs.readFileSync('./test_movies.txt');

    const obj = {
        title: 'Pirates of the Caribian',
        release: 2000,
        format: 'DVD',
        stars: [{
                name: 'Jack',
                surname: 'Sparrow'
            },
            {
                name: 'Robert',
                surname: 'Downey JR'
            }
        ]
    };

    // /v1/movie/file
    describe('POST /v1/movie/file', () => {
        // OK
        test('should return 200 and successfully parse file', async() => {

            const res = await request(app)
                .post('/v1/movie/file')
                .set('Content-Type', 'multipart/form-data')
                .attach('example', example, { filename: 'test_movies.txt' })
                .expect(httpStatus.OK);
            expect(res.body).toEqual({ message: 'File was parsed!' });

        }, 50000);

        // parse 2 times
        test('should return 400 and not parse file', async() => {

            const res = await request(app)
                .post('/v1/movie/file')
                .set('Content-Type', 'multipart/form-data')
                .attach('example', example, { filename: 'test_movies.txt' })
                .expect(httpStatus.OK);
            expect(res.body).toEqual({ message: 'File was parsed!' });
            const res2 = await request(app)
                .post('/v1/movie/file')
                .set('Content-Type', 'multipart/form-data')
                .attach('example', example, { filename: 'test_movies.txt' })
                .expect(httpStatus.BAD_REQUEST);
            expect(res2.body).toEqual({ message: 'Parsing error' });

        }, 50000);

        // parse no file
        test('should return 400 and file not found', async() => {
            const res = await request(app)
                .post('/v1/movie/file')
                .send({ example: 'ggg' })
                .expect(httpStatus.BAD_REQUEST);
            expect(res.body).toEqual({ message: 'File not found!' });

        }, 50000);
    });


    // /v1/movie POST
    describe('POST /v1/movie', () => {
        // OK
        test('should return 201 and successfully create title', async() => {
            const res = await request(app)
                .post('/v1/movie')
                .send(obj)
                .expect(httpStatus.CREATED);

            expect(res.body.title).toEqual(obj.title);
            expect(res.body.release).toEqual(obj.release);
            expect(res.body.format).toEqual(obj.format);
            expect(res.body.stars[0].name).toEqual(obj.stars[0].name);
            expect(res.body.stars[0].surname).toEqual(obj.stars[0].surname);
            expect(res.body.stars[1].name).toEqual(obj.stars[1].name);
            expect(res.body.stars[1].surname).toEqual(obj.stars[1].surname);

        }, 50000);

        // send 2 times one obj
        test('should return 400 and message title already taken', async() => {
            const res = await request(app)
                .post('/v1/movie')
                .send(obj)
                .expect(httpStatus.CREATED);

            const res2 = await request(app)
                .post('/v1/movie')
                .send(obj)
                .expect(httpStatus.BAD_REQUEST);

            expect(res2.body.message).toEqual('Title already taken');

        }, 50000);

        // send empty obj
        test('should return 400 and title is required', async() => {
            const res = await request(app)
                .post('/v1/movie')
                .send({})
                .expect(httpStatus.BAD_REQUEST);

            expect(res.body.message).toEqual('\"title\" is required');

        }, 50000);
    }, 50000);

    // /v1/movie GET
    describe('GET /v1/movie', () => {

        // OK empty db
        test('should return 200 and object with empty array', async() => {
            const res = await request(app)
                .get('/v1/movie')
                .send()
                .expect(httpStatus.OK);

            expect(res.body).toEqual({
                results: [],
                page: 1,
                limit: 10,
                totalPages: 0,
                totalResults: 0
            });
        }, 50000);

        // OK db with parsing file
        test('should return 200 and object with 3 titles', async() => {
            await request(app)
                .post('/v1/movie/file')
                .set('Content-Type', 'multipart/form-data')
                .attach('example', example, { filename: 'test_movies.txt' })
                .expect(httpStatus.OK);

            const res = await request(app)
                .get('/v1/movie?limit=3&page=2')
                .set('Content-Type', 'multipart/form-data')
                .expect(httpStatus.OK);

            expect(res.body.page).toEqual(2);
            expect(res.body.limit).toEqual(3);
            expect(res.body.totalPages).toEqual(9);
            expect(res.body.totalResults).toEqual(25);
            expect(res.body.results[0].title).toEqual('Casablanca');
            expect(res.body.results[1].title).toEqual('Charade');
            expect(res.body.results[2].title).toEqual('Cool Hand Luke');
        }, 50000);

        // OK with find by title
        test('should return 200 and object with finding title', async() => {
            await request(app)
                .post('/v1/movie/file')
                .set('Content-Type', 'multipart/form-data')
                .attach('example', example, { filename: 'test_movies.txt' })
                .expect(httpStatus.OK);

            const res = await request(app)
                .get('/v1/movie/?title=2001 ')
                .set('Content-Type', 'multipart/form-data')
                .expect(httpStatus.OK);

            expect(res.body.totalResults).toEqual(1);
            expect(res.body.results[0].title).toEqual('2001: A Space Odyssey');
        }, 50000);

        // OK with find by actor name
        test('should return 200 and object with finding title by actor name', async() => {
            await request(app)
                .post('/v1/movie/file')
                .set('Content-Type', 'multipart/form-data')
                .attach('example', example, { filename: 'test_movies.txt' })
                .expect(httpStatus.OK);

            const res = await request(app)
                .get('/v1/movie/?name= Earl ')
                .set('Content-Type', 'multipart/form-data')
                .expect(httpStatus.OK);

            expect(res.body.results[0].title).toEqual('Star Wars');
            expect(res.body.results[0].stars[4].name).toEqual('James Earl');
        }, 50000);
    }, 50000);


    // /v1/movie/{movieId}
    describe('GET /v1/movie/{movieId}', () => {
        // invalid id
        test('should return 400 and msg: movieId must be valid mongo id', async() => {

            const res = await request(app)
                .get('/v1/movie/gggg')
                .expect(httpStatus.BAD_REQUEST);
            expect(res.body.message).toEqual(`\""movieId"" must be a valid mongo id`);

        }, 50000);

        // not found movie
        test('should return 404 and msg: movieId not found', async() => {

            const res = await request(app)
                .get('/v1/movie/60400401c2b4a40723e6862c')
                .expect(httpStatus.NOT_FOUND);
            expect(res.body.message).toEqual('Movie not found');

        }, 50000);

        // find movie
        test('should return 200 and movie obj', async() => {
            await request(app)
                .post('/v1/movie')
                .send(obj)
                .expect(httpStatus.CREATED);

            const res = await request(app)
                .get('/v1/movie?limit=1&page=1')
                .set('Content-Type', 'multipart/form-data')
                .expect(httpStatus.OK);
            // console.log(res.body.results[0].id);
            const res_2 = await request(app)
                .get(`/v1/movie/${res.body.results[0].id}`)
                .expect(httpStatus.OK);
            expect(res_2.body.title).toEqual(obj.title);

        }, 50000);
    });


    // delete /v1/movie/{movieId}
    describe('DELETE /v1/movie/{movieId}', () => {
        // invalid id
        test('should return 400 and msg: movieId must be valid mongo id', async() => {

            const res = await request(app)
                .delete('/v1/movie/gggg')
                .expect(httpStatus.BAD_REQUEST);
            expect(res.body.message).toEqual(`\""movieId"" must be a valid mongo id`);

        }, 50000);

        // not found movie
        test('should return 404 and msg: movieId not found', async() => {

            const res = await request(app)
                .delete('/v1/movie/60400401c2b4a40723e6862c')
                .expect(httpStatus.NOT_FOUND);
            expect(res.body.message).toEqual('Movie not found');

        }, 50000);

        // delete movie
        test('should return 200 and delete movie obj', async() => {
            await request(app)
                .post('/v1/movie')
                .send(obj)
                .expect(httpStatus.CREATED);

            const res = await request(app)
                .get('/v1/movie?limit=1&page=1')
                .set('Content-Type', 'multipart/form-data')
                .expect(httpStatus.OK);

            const res_2 = await request(app)
                .delete(`/v1/movie/${res.body.results[0].id}`)
                .expect(httpStatus.NO_CONTENT);
        }, 50000);
    });

});