const express = require("express")
const router = express.Router()
const voteModel = require("../Model/Vote")
const candidateModel = require("../Model/Candidates")
const userModel = require("../Model/Users");
const categoryModel = require("../Model/Categories")

const handleErrors = (err)=>{
    // console.log(err.message, err.code);
    console.log(err.errors);
    // console.log(err.errors.password.properties.message);
    let errors = { who: " "}
    if(err.code === 11000){
        if(err.keyValue.who){
            errors.who = "that email already exists"
            return errors.who
        }
    }

    if(err.message.includes("Votes validation")){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message
        })
        return errors
    }
    return errors
}


router.post("/Vote/:id/:userId/:catID", async (req, res)=>{
    try{
        const id = req.params.id;
        const userId = req.params.userId;
        const catID = req.params.catID;
        const whoCheck = await voteModel.find().where("who").equals(`${userId}`).count();
        const whoQuery = await voteModel.find({"who": `${userId}`}).where('category').equals(`${catID}`).count();

        const catCheck = await voteModel.find().where("category").equals(`${catID}`).count();
        const voteCheck = await voteModel.count()
        const candidate = await candidateModel.findById(id);
        const user = await userModel.findById(userId);
        const category = await categoryModel.findById(catID);
        //Empty array is falsey
        //Non-empty array is truthey
        if(voteCheck){
            if(!whoCheck){
                    const vote = await voteModel(req.body);
                    vote.for = candidate;
                    vote.who = user;
                    vote.category = category;
                    vote.save()
                    candidate.votes.push(vote)
                    candidate.save()
                    res.status(201).json({message: `Voted, ${user.name} hasn't voted, who is: ${whoCheck}`})
            }else{
                if(whoQuery){
                    res.status(400).json({message:`who shows: ${whoCheck} and category shows ${catCheck} can't vote in the same category twice`})
                }else{
                    const vote = await voteModel(req.body);
                    vote.for = candidate;
                    vote.who = user;
                    vote.category = category;
                    vote.save()
                    candidate.votes.push(vote)
                    candidate.save()
                    res.status(201).json({ message: "Voted, haven't voted in this category before"})
                }
            }
        }else{
                const vote = await voteModel(req.body);
                vote.for = candidate;
                vote.who = user;
                vote.category = category;
                vote.save()
                candidate.votes.push(vote)
                candidate.save()
                res.status(201).json({message: "Voted, vote collection was empty"})
        }
    }catch(err){
        const errorMessage = handleErrors(err)
        res.status(200).json({message: errorMessage})
    }
})

router.get("/Vote/:id", async (req, res)=>{
    try{
        const id = req.params.id
            const candidate = await candidateModel.find().where("election").equals(`${id}`)
            res.status(200).json({data: candidate})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})
router.get("/Votes", async (req, res)=>{
    try{
            const votes = await voteModel.find()
            res.status(200).json({votes})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = router