const Joi = require('joi');
const { objectId } = require('./custom.validation');


/*
  name: req.body.data.name,
  releaseDate: req.body.data.releaseDate,
  format: req.body.data.format,
  actorList: req.body.data.actorList
*/

const addNewMovie = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        release: Joi.number().integer().required(),
        format: Joi.string().required(),
        stars: Joi.array().items(Joi.object().keys({
            name: Joi.string().required(),
            surname: Joi.string().required(),
        })).required(),
    }),
};

const getMovie = {
    query: Joi.object().keys({
        title: Joi.string().trim(),
        name: Joi.string().trim(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getMovieById = {
    params: Joi.object().keys({
        movieId: Joi.string().custom(objectId),
    }),
};

const deleteMovie = {
    params: Joi.object().keys({
        movieId: Joi.required().custom(objectId),
    }),
};

const parseFile = {
    body: Joi.object().keys({
        movieId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    addNewMovie,
    getMovie,
    getMovieById,
    deleteMovie,
    parseFile,
};