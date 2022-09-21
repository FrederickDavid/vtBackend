const express = require("express")
const router = express.Router()
// const mongoose = require("mongoose")
const electionModel = require("../Model/Election")
const userModel = require("../Model/Users")
const jwt = require("jsonwebtoken")
const transporter  = require("../utils/email")


const verification = (req, res, next)=>{
    const authCheck = req.headers.authorization
    try{
        if(authCheck){
            const token = authCheck.split(" ")[1]
            jwt.verify(token, "IaMtheGreatestDeveloPer", (err, payload)=>{
                if(err){
                    res.status(400).json({message: "Please Check your token"})
                }
                req.user = payload
                next()
            })
        }
    }catch(err){
        res.status(400).json({message: "You are not authorized for this operation"})
    }
}

router.post("/:id", async (req, res)=>{
    try{
        const id = req.params.id
        const election = await electionModel(req.body);
        const user = await userModel.findById(id);
        election.Author = user;
        election.save()
        user.Election.push(election);
        user.isAdmin = true
        user.save()
        const mailOptions ={
            from: process.env.USER,
			to: user.email,
			subject: "Account verification",
			html: `
            <h3>
            Election has been created successfully by you: ${user.name}, This is the Election ID: <bold>${user._id}</bold>, Share only with people who should participate in the election
            </h3>
            `,
        }

        transporter.sendMail(mailOptions,(err, info)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }
        })
        res.status(200).json({message: "Election successfully created"})
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

router.delete("/Election/:id/election/:electId", async (req, res)=>{
    try{
        const id = req.params.id
            const electId = req.params.electId
            await electionModel.findByIdAndDelete(electId)
            const user = await userModel.findById(id)
            user.Election.pull(electId)
            if(user.Election.length === 0){
                user.isAdmin = false
            }
            user.save()
            res.status(200).json({message: "Election Deleted Successfully"})
            
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.patch("/Election/:id", async (req, res)=>{
    try{
        const id = req.params.id
        const election = await electionModel.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json({data: election})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.get("/Election/:ID", async (req, res)=>{
    try{
        const ID = req.params.ID
        if(ID){
            const election = await electionModel.find().where("Author").equals(`${ID}`)
            res.status(200).json({data: election})
        } else {
            res.status(400).json({error: "Election not found"})
        }
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.get("/OneElection/:id", async (req, res)=>{
    try{
        const id = req.params.id;
        const Election = await electionModel.findById(id).populate("candidates");
        // const SeeVotes = Election.candidates.populate()
        res.status(200).json({Election})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})
module.exports = router