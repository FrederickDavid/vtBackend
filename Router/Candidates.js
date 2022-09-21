const express = require("express")
const router = express.Router()
const dotenv = require("dotenv")
dotenv.config({path: './config.env'})
const categoryModel = require("../Model/Categories")
const candidateModel = require("../Model/Candidates")
const electionModel = require("../Model/Election")
const multer = require("multer")
const path = require("path")
const cloudinary = require("../utils/cloudinary")

const Storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "Uploads")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + "-"+ Math.floor(Math.random() * 1e9)
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({storage: Storage}).single("image")


router.post("/Candidate/:id", upload, async(req, res)=>{
    try{
        const result = await cloudinary.uploader.upload(req.file.path)
        const id = req.params.id
        const candidate = await candidateModel({
            name: req.body.name,
            image: result.secure_url,
            CloudinaryPath: result.public_id,
            manifesto: req.body.manifesto
        })
        const category = await categoryModel.findById(id)
        candidate.position = category
        category.candidates.push(candidate)
        category.save()
        const election = await electionModel.findById(category.election)
        election.candidates.push(candidate)
        election.save()
        candidate.Election = election
        candidate.save()
        res.status(200).json({data: id})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.get("/Candidates/:id", async (req, res)=>{
    try{
        const id = req.params.id
        // const candidate = await categoryModel.findById(id).populate("candidates")
        const candidate = await candidateModel.find().where("position").equals(`${id}`)
        res.status(200).json({data: candidate})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.delete("/Candidate/:id/who/:canId", async (req, res)=>{
    try{
        const id = req.params.id
        const canId = req.params.canId
        const category = await categoryModel.findById(id)
        await categoryModel.findByIdAndDelete(canId)
        category.candidate.pull(canId)
        category.save()
        res.status(200).json({message: "Candidate Deleted!"})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = router