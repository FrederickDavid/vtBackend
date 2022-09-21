const dotenv = require("dotenv")
dotenv.config({path: './config.env'})
require('./utils/db')
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors({origin: "*"}))
app.use("/Uploads", express.static(path.join(__dirname, "uploads")))

app.get("/", (req, res)=>{
    res.send("Welcome to onevote")
})

app.use("/", require("./Router/Categories"))
app.use("/api", require("./Router/users"))
app.use("/api", require("./Router/Election"))
app.use("/", require("./Router/Candidates"))
app.use("/api", require("./Router/Vote"))
app.listen(PORT, ()=>{
    console.log(`Running on PORT: ${PORT}`)
})