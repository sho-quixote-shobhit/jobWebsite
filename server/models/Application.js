const mongoose = require('mongoose')

const ApplicationSchema = new mongoose.Schema({
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    recruiter : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Job'
    },
    status : {
        type : String,
        default : 'In Progress'
    }
},{timestamps : true})

module.exports = mongoose.model('Application' , ApplicationSchema)