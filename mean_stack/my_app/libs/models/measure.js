var mongoose = require('mongoose');

var Measure = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required:true
    },
    unit: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        required:true
    }
});



module.exports = mongoose.model('Measure', Measure);
