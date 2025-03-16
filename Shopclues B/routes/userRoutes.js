const express = require('express');
const{addUser,loginUser,registerUser} = require('../controllers/userController')

const router = express.Router();

router.post('/users',addUser);
router.post('/register',registerUser);
router.post('/login',loginUser);

module.exports = router;