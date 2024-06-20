class CustomError extends Error{
    constructor(message, statusCode){
        super(message);  //calling constructor of errpor class
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);//pass current objectand custom error
    }
}

module.exports = CustomError;

//const error = new CustomError('some error message', 404)