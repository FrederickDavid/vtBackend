const mongoose = require("mongoose")
const Schema = mongoose.Schema

const voteSchema = new Schema({
    count: {type: Number, required: true},
    for:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Candidates"
    },
    who:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users"
    },
    category:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Categories"
    }
}, {timestamp: true});

const voteModel = mongoose.model("Votes", voteSchema)

module.exports = voteModel