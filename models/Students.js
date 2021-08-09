const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')



const studentSchema = new mongoose.Schema({
    surname: {
        type: String,
        require: true
    },
    firstname : {
        type: String,
        required: true
    },
    matricNo : {
       type : String,
       required: true 
    },
    email : {
        type: String,
        required: true
    },
    level : {
        type: Number,
        required: true
    },
    program : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})


module.exports = mongoose.model('Students', studentSchema)