const express = require('express');
const validate = require('../../middlewares/validate');
const movieValidation = require('../../validations/movie.validation');
const movieController = require('../../controllers/movie.controller');
const multer = require('multer');

const router = express.Router();

var upload = multer();

router.route('/')
    .post(validate(movieValidation.addNewMovie), movieController.addNewMovie)
    .get(validate(movieValidation.getMovie), movieController.getMovie)

router.route('/:movieId')
    .get(validate(movieValidation.getMovieById), movieController.getMovieById)
    .delete(validate(movieValidation.deleteMovie), movieController.deleteMovie);

router.route('/file')
    .post(upload.single('example'), movieController.parseFile);

module.exports = router;