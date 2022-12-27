let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let reviewSchema = new Schema({
    body: String,  
    rating: Number
})

module.exports = mongoose.model('Review',reviewSchema)