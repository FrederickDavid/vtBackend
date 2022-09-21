const mongoose = require("mongoose")
const Schema = mongoose.Schema
const {isEmail} = require("validator")
// const bcrypt = require("bcrypt")

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true, validate:[isEmail, "Please enter a valid email address"]},
    password: {type: String, minlength:[4, "Minimum characters is 4"]},
    Election: [{
        type: mongoose.Types.ObjectId,
        ref: "elections"
    }],
    isAdmin: {
        type: Boolean,
    },
    isVerify: {
        type: Boolean,
    },

    OTP: {
        type: String,
    },

    mainOTP: {
        type: String,
    },

    verifiedToken: {
        type: String,
    },
}, {timestamp: true})


const userModel = mongoose.model("user", userSchema)

module.exports = userModel