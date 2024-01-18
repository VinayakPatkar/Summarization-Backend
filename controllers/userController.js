const user = require("../models/userModel");
const summary = require("../models/summarizedModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const pdf = require("pdf-parse");
const fs = require("fs");
const axios = require("axios");
const { Form } = require("react-router-dom");
const FormData = require("form-data")
exports.signup = async(req,res) => {
    const {username,email,password} = req.body;
    try {
        let userPresent = await user.findOne({email : email});
        if (userPresent){
            return res.status(400).json({message : "User already exists"})
        }
        userNew = new user({
            _id: new mongoose.Types.ObjectId(),
            username : username,
            email : email,
            password : password
        })
        const salt = await bcrypt.genSalt(10);
        userNew.password = await bcrypt.hash(password,salt);
        await userNew.save()
        .then((saved,err)=>{
            if (saved){
                return res.status(200).json({message : "Admin Created"})
            }
            if (err){
                return res.status(400).json({message : "Admin could not be created"})
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message : "Error while signing up the admin"})
    }
}
exports.login = async(req,res) => {
    const {email,password} = req.body;
    try {
        let userPresent = await user.findOne({email : email});
        if (!userPresent){
            return res.status(400).json({message : "Admin doesn't exist"});
        }
        const isMatch = await bcrypt.compare(password,userPresent.password);
        if(!isMatch){
            return res.status(400).json({message : "Incorrect password"});
        }
        const payload = {user_ : {id : userPresent._id}}
        jwt.sign(payload,process.env.JWT_KEY,{expiresIn : 3600},(err,token)=>{
            if (err) throw err;
            res.status(200).json({isAdmin: true,token : token})
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({messsage : "Server error"})
    }
}
exports.upload = async(req,res) => {
    const base_path = 'C:/Users/Dell/Desktop/summarizer/file_store/' + req.file.filename
    const formData = new FormData();
    formData.append('pdf',fs.createReadStream(base_path));
    axios.post('http://localhost:5000/data',formData,{
        headers : {
            ...formData.getHeaders(),
        }
    }).then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error)
    })
}