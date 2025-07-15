/** No model is created from this schema (therefore no collection as well). This is intended to be used as part of other schemas */
const mongoose = require( 'mongoose' );

const timeSchema = new mongoose.Schema({
    hours: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    minutes: {
        type: Number,
        default: 0,
        min: 0,
        max: 59
    },
    _id: false // a unique _id will be generated for every time part of every document. But we do not need it in this app.
});

module.exports = timeSchema;