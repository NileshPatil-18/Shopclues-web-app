const User = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

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
            user:{
                _id : newUser._id,
                name:newUser.name,
                email:newUser.email,
                mobile:newUser.mobile,
                },
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
            user:{_id:user._id,
                name:user.name,
                email:user.email
            },
        token,
        });
        
    } catch (error) {
        res.status(500).json({message:'server error', error:error.message});
    }
}


const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, mobile } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
        });
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUserProfile,
};