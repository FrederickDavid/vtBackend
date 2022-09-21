const mongoose = require("mongoose")
const Schema = mongoose.Schema

const candidateSchema = new Schema({
    name: {type: String, required: true},
    image: {type: String},
    CloudinaryPath:{
        type: String,
        required: true
    },
    manifesto: {type: String, required: true},
    position:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Categories"
    },
    election:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Elections"
    },
    votes:[{ 
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Votes"
    }]
}, {timestamp: true})

const candidateModel = mongoose.model("Candidates", candidateSchema)

module.exports = candidateModel