// imports
const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../validation');
const { application } = require('express')

// create route for registration
router.post('/register', async (req, res) => {  // sent data to the api/database to save the user info.
    
    // validate the user input (name, email, password )
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    // check if the email is already registered
    const emailExist = await User.findOne({email: req.body.email});

    if (emailExist) {
        return res.status(400).json({error: 'Email already exists'})
    }

    // hash the password -- by import bcrypt: npm install bcrypt 
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    // create a user object and save in the DB 
    const userObject = new User({
        name: req.body.name,
        email: req.body.email,
        password
    })

    // ask DB for modifications
    try {
        const savedUser = await userObject.save();
        res.json({error: null, data: savedUser._id})
    } catch (error) {
       res.status(400).json({error}); 
    }
})

// create route for login
router.post('/login', async (req, res) => {
    //  Validate user login - info
    const {error} = loginValidation (req.body);

    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    // if login info is valid, find the user
    const user = await User.findOne({email: req.body.email});
      
    // throw error if email is wrong (user does not exist in-DB)
    if (!user) {
        return res.status(400).json({error: 'Email is not valid'})
    }

    // user exists -- check for password correctness 
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    // throw error if password is wrong 
    if (!validPassword) {
        return res.status(400).json({error: 'Password is not valid'})
    }

    // create authentication token with username and id -- by import jsonwebtoken: npm install jsonwebtoken  
    const token = jwt.sign(
        // payload 
        {
            name: user.name,
            id: user.id
        },
        // TOKEN_SECRET -- make change on .evn file
        process.env.TOKEN_SECRET,
        // EXPIRATION TIME  
        {expiresIn: process.env.JWT_EXPIRES_IN},
    )
    
    // attach auth token to header
    res.header("auth-token", token).json({
        error: null, data: { token }
    }) 
})
// export the routes 
module.exports = router;

