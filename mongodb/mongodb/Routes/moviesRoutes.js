const express = require('express');
const moviesController = require('./../Controller/moviesController');

const router = express.Router();

//router.param('id', moviesController.checkId)

//it shows 5 most highest rated movies(Aliasing routes)
router.route('/highest-rated').get(moviesController.getHighestRated, moviesController.getAllMovies)

router.route('/movie-stats').get(moviesController.getMovieStats);//aggreation pipeline call for ovies stats

router.route('/movies-by-genre/:genre').get(moviesController.getMovieByGenre);//pipeline for movies genre

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createMovie)


router.route('/:id') //it will available of property praram object
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports = router;