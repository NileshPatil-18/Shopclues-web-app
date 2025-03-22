const express = require('express');
const{
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUserProfile,
} = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware');
 

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/password', authMiddleware, updateUserPassword);
router.delete('/profile', authMiddleware, deleteUserProfile);


module.exports = router;