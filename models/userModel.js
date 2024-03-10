const mongoose=require('mongoose');
const validator=require('validator');


const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    photo: String,
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        validate:{
            validator: function(v){
                return v.length>=8
            },
            message: 'Please provide a valid email address'
        }
    },
    passwordConfirm: {
        type: String,
        required: [true,' Please confirm you password']
    }

});

const user=mongoose.model('user', userSchema);
module.exports=user;