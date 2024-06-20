const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');//handel error
const jwt=require('jsonwebtoken');
const CustomError=require('./../Utils/CustomError');
const { response } = require('express');
//create usser id
exports.signup = asyncErrorHandler(async (req, res, next) => { //handelrejected promise
    const newUser = await User.create(req.body);

    //generate jwt id
    const token=jwt.sign({id: newUser._id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
    })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});
exports.login=asyncErrorHandler(async (req,res,next) => {
    const email=req.body.email;
    const password=req.body.password;
    
   // const{email,password}=req.body;
   //cheak if email and password is present in requrst body
   if(email || password){
     const error=new CustomError('please provide email id and password ',400);
     return next(error);
   }
   //cheak if user exist with given email
   const user=await User.findOne({email});

   res.status(200).json({
    status:'success',
    token:'',
    user

   })
});