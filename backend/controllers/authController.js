const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({id:userId}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
}

const registerUser = async (req, res) => {
    try {
        const {name,email,password,profileImageUrl,adminInviteToken}=req.body;

        const userExists=await User.findOne({email})
        if(userExists){
            res.status(400).json({message:"User already exists"})
        }

        let role='member';
        if(adminInviteToken&& adminInviteToken==process.env.ADMIN_INVITE_TOKEN){ role="admin"}

        const salt=await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt)
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            profileImageUrl,
            role,
        })

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }
}


const loginUser = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }
}


const getUserProfile = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }
}


const updateUserProfile = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }
}

module.exports={registerUser,loginUser,getUserProfile,updateUserProfile};