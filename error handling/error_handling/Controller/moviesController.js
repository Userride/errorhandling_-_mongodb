const { param } = require('../Routes/moviesRoutes');
const Movie = require('./../Models/movieModel');
const ApiFeatures = require('./../Utils/ApiFeatures');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const CustomError = require('./../Utils/CustomError');


//aliasing routes-->return 5 most  highest rated movies
exports.getHighestRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratings';

    next();//go to next all get all movies
}

exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {
    
        const features = new ApiFeatures(Movie.find(), req.query) // this expression must return the instance the api features
         //query->return string as key value pair...
                                .filter()
                                .sort()
                                .limitFields()
                                .paginate();
        let movies = await features.query;
    

        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        });
        
    })
    

// get all movies
exports.getMovie = asyncErrorHandler(async (req, res, next) => {
 
    //const movie = await Movie.findOne({_id: req.params.id});
    const movie = await Movie.findById(req.params.id);


    if(!movie){
        const error = new CustomError('Movie with that ID is not found!', 404);
        return next(error);
    }

    res.status(200).json({
        status: 'success',
        data: {
            movie
        }
    });
})
//create movies by post 
exports.createMovie =asyncErrorHandler(async (req, res, next) => {

    const movie = await Movie.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            movie
        }
    })
});
//update movies by id
exports.updateMovie = async (req, res, next) => {
    try{
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!updatedMovie){
            const error = new CustomError('Movie with that ID is not found!', 404);
            return next(error);
        }

        res.status(200).json({
            status: "success",
            data: {
                movie: updatedMovie
            }
        });
    }catch(err){
        res.status(404).json({
            status:"fail",
            message: err.message
        });
    }
}
//deletemovies
exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {

    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if(!deletedMovie){
        const error = new CustomError('Movie with that ID is not found!', 404);
        return next(error);
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})

//create pipeline like aggregation pipeline used to find approx value..
exports.getMovieStats = asyncErrorHandler(async (req, res, next) => {
        const stats = await Movie.aggregate([
            { $match: {ratings: {$gte: 4.5}}}, //rating greater than 4.5
            { $group: {
                _id: '$releaseYear',  //cheak on the basis of release year
                avgRating: { $avg: '$ratings'},
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                priceTotal: { $sum: '$price'},
                movieCount: { $sum: 1} //for each document it will add one
            }},
            { $sort: { minPrice: 1}} //sort the data according to min price
            //{ $match: {maxPrice: {$gte: 60}}}
        ]);

        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
                stats
            }
        });
    })
// pipeline for movies genre..
exports.getMovieByGenre = asyncErrorHandler(async (req, res, next) => {
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            {$unwind: '$genres'},
            {$group: {
                _id: '$genres',
                movieCount: { $sum: 1},
                movies: {$push: '$name'}, 
            }},
            {$addFields: {genre: "$_id"}},
            {$project: {_id: 0}},
            {$sort: {movieCount: -1}},
            //{$limit: 6}
            //{$match: {genre: genre}}
        ]);

        res.status(200).json({
            status: 'success',
            count: movies.length,
            data: {
                movies
            }
        });
    })
