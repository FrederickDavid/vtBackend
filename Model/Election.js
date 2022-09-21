const mongoose = require("mongoose")
const Schema = mongoose.Schema

const electionSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    Author: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    categories:[{ 
        type: mongoose.Types.ObjectId,
        ref: "Categories"
    }],
    candidates:[{ 
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Candidates"
    }]
}, {timestamp: true})

const electionModel = mongoose.model("election", electionSchema)

module.exports = electionModel