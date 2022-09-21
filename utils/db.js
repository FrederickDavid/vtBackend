const dotenv = require("dotenv")
dotenv.config({path: './config.env'})
const mongoose = require("mongoose")

const url = process.env.URL;
// const url = "mongodb+srv://onevote:0000onevote0000@onevote.bdvuiuh.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(url)
.then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err)
});

module.exports = mongoose