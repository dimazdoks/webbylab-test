const express = require('express');
const movieRoute = require('./movie.route');
const swagger = require('./docs.route');
const router = express.Router();

const defaultRoutes = [{
    path: '/movie',
    route: movieRoute,

}, {
    path: '',
    route: swagger,
}];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;