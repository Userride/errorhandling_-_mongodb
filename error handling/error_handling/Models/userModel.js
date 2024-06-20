const mongoose=require('mongoose');
const validator=require('validator')//used for gmail...
 const bcrypt=require('bcryptjs')

//create schema
//we have name ,email,password,confirmpassword,photo
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter your name']
    },
    email:{
        type:String,
        required:[true,'please enter an email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please enter a valid email']
    },
    photo:String,
    password:{
        type:String,
        required:[true,'please enter a password'],
        minlength:8
    },
    confirmpassword:{
        type:String,
        required:[true,'please confirm your password'],
        validate:{
            validator:function(val){
                return val==this.password;
            },
            message:'password and confirm  are not match'
        }
    }

})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    //encrypt the password before saving it
    this.password=await bcrypt.hash(this.password,12);
    this.confirmpassword=undefined;
    next()
})

//create user model
 const User=mongoose.model('user',userSchema);
 module.exports=User;