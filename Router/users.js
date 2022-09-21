const dotenv = require("dotenv")
dotenv.config({path: './config.env'})
const express = require("express")
const userModel = require("../Model/Users")
const verifiedModel = require("../Model/verifiedModel")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const crypto = require('crypto');
const transporter  = require("../utils/email")

const handleErrors = (err)=>{
    // console.log(err.message, err.code);
    console.log(err.errors);
    // console.log(err.errors.password.properties.message);
    let errors = { email: " ", password: " "}
    if(err.code === 11000){
        if(err.keyValue.email){
            errors.email = "that email already exists"
            return errors.email
        }
    }

    if(err.message.includes("Users validation")){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message
        })
        return errors
    }
    return errors
}

router.post("/register/user", async(req, res)=>{
    try{
        const { email, name } = req.body;
        const tokenValue = crypto.randomBytes(64).toString("hex")
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        const myToken = jwt.sign({ tokenValue }, process.env.SECRET, {
            expiresIn: process.env.EXPIRES
        });
        const user = await userModel.create({
            name,
            email,
            password: hashPassword,
            verifiedToken: myToken,
            isAdmin: false
        })
        await verifiedModel.create({
            token: myToken,
            userID: user._id,
            _id: user._id,
        })

        const mailOptions ={
            from: process.env.USER,
			to: email,
			subject: "Account verification",
			html: `
            <h3>
            Thanks for sign up with us ${user.name}, Please use the <a
            href="https://onevoteapp.herokuapp.com/Login"
            >Link to complete your sign up</a>
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
        res.status(200).json({message: "check your mail to continue...", token: myToken, user: user._id})
    }catch(err){
        const errorMessage = handleErrors(err)
        res.status(400).json({error: errorMessage})
        console.log(err.message)
    }
})


//Verify user
router.post("/:id/:token", async (req, res)=>{
    try{
        const user = await userModel.findById(req.params.id);
        if (user){
            if (user.verifiedToken !== ""){
                await userModel.findByIdAndUpdate( user._id, {
                    isVerify: true,
                    verifiedToken: "",
                }, {new: true})
                await verifiedModel.findByIdAndUpdate(
                    user._id, {
                        userID: user._id,
                        token: ""
                    }, {new: true}
                );
                res.status(201).json({ message: "verification complete"})
            }else {
                res.status(404).json({
					message: "verification failed",
				});
            }
        }else {
            res.status(404).json({
                message: "User Not found",
            });
        }
    }catch(err){
        res.status(400).json({error: err.message})
    }
})



//Log user in 
router.post("/login", async(req, res)=>{
    try{
        const signed = await userModel.findOne({email:req.body.email})
        if(signed){
            const checkPassword = await bcrypt.compare(req.body.password, signed.password)
            if(checkPassword){
                const {password, ...data} = signed._doc
                const token = jwt.sign({
                    id: signed._id,
                    email: signed.email,
                    isAdmin: signed.isAdmin,
                }, "IaMtheGreatestDeveloPer", {expiresIn: "1d"})
                res.status(200).json({message: `welcome Back ${signed.name}`, data: {...data, token}})
            }else{
                res.status(400).json({message: "Your Password is incorrect"})
            }
        }else{
            res.status(400).json({message: "User not found"})
        }
    }catch(err){
        res.status(400).json({message: err.message})
    }
} )

//Get all Users
router.get("/Users", async(req, res)=>{
    try{
        const user = await userModel.find()
        res.status(200).json({data: user})
    }catch(err){
        res.status(400).json({message: err.message})
        console.log(err.message)
    }
})

//Get one user
router.get("/User/:id", async (req, res)=>{
    try{
        const id = req.params.id
        const user = await userModel.findById(id)
        res.status(200).json({data: user})
    }catch(err){
        res.status(400).json({message: err.message})
        console.log(err.message)
    }
})

//Update One user
router.patch("/User/:id", async(req, res)=>{
    try{
        const id =req.params.id
        const user = await userModel.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json({data: user})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

//Delete User
router.delete("/User/:id", async (req, res)=>{
    try{
        const id = req.params.id;
        const user = await userModel.findOneAndDelete(id)
        res.status(200).json({data: user})
    }catch(err){
        res.status(400).json({message: err.message})
        console.log(err.message)
    }
})


module.exports = router