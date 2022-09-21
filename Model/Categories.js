const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categorySchema = new Schema({
    position: {type: String, required: true},
    election:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Elections"
    },
    candidates: [{ 
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Candidates"
    }]
}, {timestamp: true})

const categoryModel = mongoose.model("Categories", categorySchema)

module.exports = categoryModel