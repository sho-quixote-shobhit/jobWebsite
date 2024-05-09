const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    profile : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    skills: [
        {
            type: String,
            required: true
        }
    ],
    company: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    appliedBy : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    description : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Job', jobSchema);