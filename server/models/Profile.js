const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    profile : {
        type : String
    }
})

module.exports = mongoose.model('Profile' , ProfileSchema)