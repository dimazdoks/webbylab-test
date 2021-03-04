## Commands

Install the dependencies:
```bash
yarn install
```
Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```
## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_URL=mongodb://127.0.0.1:27017/node-boilerplate
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Movie routes**:\
`POST /v1/movie/file` - parsing file with data\
`POST /v1/movie` - add new title\
`GET /v1/movie` - get movies by title/actor name or sort by title\
`GET /v1/movie/{movieId}` - get movie by unique mongo id tag\
`DELETE /v1/movie/{movieId}` - delete movie by unique mongo id tag

Loading file example:
![image](https://user-images.githubusercontent.com/30863273/109883551-429c5100-7c84-11eb-85c4-ac9961d92326.png)


## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point

## Boilerplate
https://github.com/hagopj13/node-express-boilerplate

## License

[MIT](LICENSE)
