const User = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

const addUser = async(req, res)=>{
    try {

        console.log(req.body);
        const {name,email,mobile,password} = req.body;

        if(!name || !email || !mobile || !password){
            return res.status(400).json({
                message:'all fields are required'
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:'user already exists'
            });
        }
        const newUser = new User({name,email,mobile,password});
        await newUser.save();
        res.status(201).json({
            message:'user added succcesfully',
            user:newUser
        });
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            error: error.message
        });
    }
};

const registerUser = async(req, res)=>{
    try {
        const {name,email,mobile,password} =req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'user already exists'});
        }

        const newUser = new User({name,email,mobile,password});
        await newUser.save();

        const token = generateToken({id:newUser._id,email:newUser.email});

        res.status(201).json({message:'user registered successfully',
            user:{userId : newUser.userId,name:newUser.name, email:newUser.email},
            token,
        });

    } catch (error) {
        res.status(500).json({message:'server error', erro: error.message});
    }
};

const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'user not found'});
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:'invalid credentials'});
        }
       
        const token = generateToken({ id: user._id, email: user.email });
        res.status(200).json({message:"Login Succesfull",
            user:{name:user.name,email:user.email},
        token,
        });
        
    } catch (error) {
        res.status(500).json({message:'server error', error:error.message});
    }
}

module.exports = {addUser,registerUser,loginUser};