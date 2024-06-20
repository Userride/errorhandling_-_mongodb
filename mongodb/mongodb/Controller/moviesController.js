const { param } = require('../Routes/moviesRoutes');
const Movie = require('./../Models/movieModel');
const ApiFeatures = require('./../Utils/ApiFeatures');

//aliasing routes-->return 5 most  highest rated movies
exports.getHighestRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratings';

    next();//go to next all get all movies
}

exports.getAllMovies = async (req, res) => {
    try{
        const features = new ApiFeatures(Movie.find(), req.query) // this expression must return the instance the api features
         //query->return string as key value pair...
                                .filter()
                                .sort()
                                .limitFields()
                                .paginate();
        let movies = await features.query;
        //Mongoose 6.0 or less
        /**************Mongoose 6.0 or less************** 
        const excludeFields = ['sort', 'page', 'limit', 'fields'];
        const queryObj = {...req.query};
        excludeFields.forEach((el) => {
            delete queryObj[el]
        })
        const movies = await Movie.find(queryObj);
        **************************************************/

        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
    
}
// get all movies
exports.getMovie = async (req, res) => {
    try{
        //const movie = await Movie.findOne({_id: req.params.id});
        const movie = await Movie.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}
//create movies by post 
exports.createMovie = async (req, res) => {
    try{
        const movie = await Movie.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}
//update movies by patch
exports.updateMovie = async (req, res) => {
    try{
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

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
//delete movies
exports.deleteMovie = async (req, res) => {
    try{
        await Movie.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    }catch(err){
        res.status(404).json({
            status:"fail",
            message: err.message
        });
    }
}

//create pipeline like aggregation pipeline used to find approx value..
exports.getMovieStats = async (req, res) => {
    try{
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
    }catch(err) {
        res.status(404).json({
            status:"fail",
            message: err.message
        });
    }
}
// pipeline for movies genre..
exports.getMovieByGenre = async (req, res) => {
    try{
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
    }catch(err) {
        res.status(404).json({
            status:"fail",
            message: err.message
        });
    }
}
