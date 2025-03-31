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
        // console.log("Provided token:", adminInviteToken);
        // console.log("Expected admin token:", process.env.ADMIN_INVITE_TOKEN);

        if(adminInviteToken&& adminInviteToken==process.env.ADMIN_INVITE_TOKEN){ 
            role="admin"
        }

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
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            res.status(401).json({message:"Invalid credentials"})

        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(401).json({message:"Invalid credentials"})
        }
        res.status(200).json({
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


const getUserProfile = async (req, res) => {
    try {
        const user=await User.findById(req.user._id).select('-password');
        if(!user){
            res.status(404).json({message:"User not found"})
        }
        res.json(user)

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }
}


const updateUserProfile = async (req, res) => {
    try {
        const user=await User.findById(req.user._id).select('-password');
        if(!user){
            res.status(404).json({message:"User not found"})
        }

        user.name=req.body.name||user.name;
        user.email=req.body.email||user.email;

        if (req.body.password){
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(req.body.password,salt)
        }
        const updatedUser=await user.save();
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            role:updatedUser.role,
            token:generateToken(updatedUser._id)
        })

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }
}

module.exports={registerUser,loginUser,getUserProfile,updateUserProfile};