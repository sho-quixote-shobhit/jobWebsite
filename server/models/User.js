const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    photo : {
        type : String,
        default : 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'
    },
    profession : {
        type : String,
        required : true
    },
    resume : {
        type : String,
        default : 'no'
    },
    profile : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile'
    },
    jobs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Job'
    }],
    skills : [{
        type : String,
    }],
    resetToken : String,
    expireToken : Date
})

module.exports = mongoose.model('User' , UserSchema);


