const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { movieService } = require('../services');


const addNewMovie = catchAsync(async(req, res) => {
    const movie = await movieService.createMovie(req.body);
    res.status(httpStatus.CREATED).send(movie);
});

const getMovie = catchAsync(async(req, res) => {
    const filter = pick(req.query, ['title', 'name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await movieService.queryMovies(filter, options);
    res.send(result);
});

const getMovieById = catchAsync(async(req, res) => {
    const movie = await movieService.getMovieById(req.params.movieId);
    if (!movie) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Movie not found');
    }
    res.send(movie);
});

const deleteMovie = catchAsync(async(req, res) => {
    await movieService.deleteMovie(req.params.movieId);
    return res.status(httpStatus.NO_CONTENT).send({ message: 'Deleted' });
});

const parseFile = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: 'File not found!' });
        }

        const result = await movieService.parseFile(req.file.buffer.toString());
        if (result) { return res.status(httpStatus.OK).send({ message: 'File was parsed!' }); }
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: 'Parsing error' });
    }
};

module.exports = {
    addNewMovie,
    getMovie,
    getMovieById,
    deleteMovie,
    parseFile,
};