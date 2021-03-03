const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    release: {
        type: Number,
        required: true,
    },
    format: {
        type: String,
        required: true,
        trim: true,
    },
    stars: [{
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        }
    }],
}, {
    timestamps: true,
});

// add plugin that converts mongoose to json
movieSchema.plugin(toJSON);
movieSchema.plugin(paginate);

// Check if Title is taken
movieSchema.statics.isTitleTaken = async function(title, excludeMovieId) {
    const movie = await this.findOne({ title, _id: { $ne: excludeMovieId } });
    return !!movie;
};

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;