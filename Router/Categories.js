const express = require("express")
const router = express.Router()
const categoryModel = require("..//Model/Categories")
const electionModel = require("../Model/Election")


router.route("/Category/:Id").post( async (req, res)=>{
    try{
        // const id = req.params.Id
        const election = await electionModel.findById(req.params.Id)
        const category = await categoryModel(req.body)
        category.election = election
        category.save()
        election.categories.push(category)
        election.save()
        res.status(200).json({data: category})
    }catch(err){
        res.status(400).json({message: err.message})
        console.log(err.message)
    }
})

router.get("/Category/:id", async (req, res)=>{
    try{
        const id = req.params.id
        // const category = await electionModel.findById(id).populate("categories")
        const category = await categoryModel.find().where("election").equals(`${id}`)
        res.status(200).json({data: category})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.get("/Results/:id", async (req, res)=>{
    try{
        const id = req.params.id
        // const category = await electionModel.findById(id).populate("categories")
        const category = await categoryModel.findById(id).populate("candidates")
        res.status(200).json({data: category})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.delete("/Category/:electId/Election/:id", async (req, res)=>{
    try{
        const id = req.params.id
        const electId = req.params.electId
        await categoryModel.findByIdAndDelete(id)
        const election = await electionModel.findById(electId)
        election.categories.pull(id)
        election.save()
        res.status(200).json({message: "Category Deleted Successfully"})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.patch("/Category/:id", async (req, res)=>{
    try{
        const id = req.params.id
        const category = await categoryModel.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json({data: category})
    }catch(err){
        res.status(200).json({message: err.message})
    }
})

module.exports = router