const Joi = require('joi');
const jwt = require('jsonwebtoken')

// validating registration -- by import Joi: npm install joi 
const registerValidation = (data) => {
    const schema = Joi.object(
        {
            name: Joi.string().min(6).max(255).required(),
            email: Joi.string().min(6).max(255).required(),
            password: Joi.string().min(6).max(255).required() 
        }
    );
    return schema.validate(data);
};

// validating login registration
const loginValidation = (data) => {
    const schema = Joi.object(
        {
            email: Joi.string().min(6).max(255).required(),
            password: Joi.string().min(6).max(255).required() 
        }
    );
    return schema.validate(data);
};

// logic to verify our token (JWT) 
const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    
    // if the token is not valid
    if(!token) return res.status(401).json({ error: "Access Denied"});

    // if the token is valid
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Token is not valid"});
    }

}
// export register Validation
module.exports = {registerValidation, loginValidation,verifyToken };