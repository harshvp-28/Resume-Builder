
//controller for user registration
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import User from "../../models/userModel.js";
import Resume from '../../models/resume.js';

const genToken=(userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'})
    return token;
}


//POST: /api/users/register
export const registerUser= async(req,res)=> {
    try {
        const {name,email,password}=req.body;

        if(!name || !email || !password) {
            res.status(400).json({message: 'Missing Required Fields'})
        }

        const user=await User.findOne({email})
        if(user) {
            res.status(400).json({message: 'User Already Exists'})
        }

        //create new user
        const hashpwd=await bcrypt.hash(password,10)
        const newUser=await User.create({
            name,email,password:hashpwd
        })

        const token=genToken(newUser._id)
        newUser.password=undefined;
        return res.status(201).json({message:'User Created Successfully',token,user:newUser})

    } catch(error) {
        return res.status(400).json({message:error.message})
    }
}


//Controller for Login
// POST: /api/user/login


export const loginUser= async(req,res)=> {
    try {
        const {email,password}=req.body;

        
        const user=await User.findOne({email})
        if(!user) {
            res.status(400).json({message: 'Invalid Email or Password'})
        }

        //check password
        if(!user.comparePassword(password)) {
            res.status(400).json({message: 'Invalid Email or Password'})
        }

        const token=genToken(user._id)
        user.password=undefined;
        return res.status(200).json({message:'Login Successfully',token, user})

    } catch(error) {
        return res.status(400).json({message:error.message})
    }
}

//for getting user by id
// GET: /api/users/data

export const getUserbyI= async(req,res)=> {
    try {
        const userId=req.userId; // middleware creates this userId

        

        const user=await User.findById(userId)
        if(!user) {
            res.status(404).json({message: 'User not found'})
        }

        user.password=undefined;
        return res.status(200).json({user})

    } catch(error) {
        return res.status(400).json({message:error.message})
    }
}


//controller for getting resumes
//GET: /api/user/resumes

export const getUserResumes= async(req,res)=>{
    try {
        const userId=req.userId;
        
        const resumes=await Resume.find({userId})
        return  res.status(200).json({resumes})

    } catch(error) {
        return res.status(400).json({message:error.message})
    }

}

