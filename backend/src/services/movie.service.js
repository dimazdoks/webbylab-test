const httpStatus = require('http-status');
const { Movie } = require('../models');
const ApiError = require('../utils/ApiError');
const parseFullName = require('parse-full-name').parseFullName;


//Create a movie
const createMovie = async(movieBody) => {
    if (await Movie.isTitleTaken(movieBody.title)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken');
    }
    const movie = await Movie.create(movieBody);
    return movie;
};


/**
 * Query for movies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMovies = async(filter, options) => {
    const movies = await Movie.paginate(filter, options);
    return movies;
};

// Get movie by id
const getMovieById = async(id) => {
    return Movie.findById(id);
};


// Delete movie by id
const deleteMovie = async(movieId) => {
    const movie = await getMovieById(movieId);
    if (!movie) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Movie not found');
    }
    await movie.remove();
    return movie;
};

function parseStr(str) {
    const index = str.indexOf(":");
    return str.slice(index + 1);
}

function parseActorList(str) {
    const actorObjectList = [];
    str.split(",").forEach(string => {
        const parseData = parseFullName(string);

        let name = (parseData.middle) ? `${parseData.first} ${parseData.middle}` : parseData.first;
        let surname = parseData.last;

        actorObjectList.push({ name, surname });
    });

    return actorObjectList;
}

const parseFile = async(data) => {
    const dataArr = data.split("\n").filter(word => !/^\s*$/.test(word));
    let parsedData = [];

    for (let x = 0; x < dataArr.length; x++) {
        const newFilm = {
            title: parseStr(dataArr[x]).trim(),
            release: parseStr(dataArr[x + 1]).trim(),
            format: parseStr(dataArr[x + 2]).trim(),
            stars: parseActorList(parseStr(dataArr[x + 3]))
        };

        const date = parseInt(newFilm.release);
        if ((isNaN(date) || date > 2021 || date < 1895))
            throw new ApiError(httpStatus.BAD_REQUEST, `Date ${date.release} is unreal.`);

        x += 3;
        parsedData.push(newFilm);
    }
    // console.log(parsedData);
    return Movie.insertMany(parsedData);
};

module.exports = {
    createMovie,
    queryMovies,
    getMovieById,
    deleteMovie,
    parseFile,
};