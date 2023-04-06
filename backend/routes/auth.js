const express = require('express')
const router = express.Router() 
const User = require('../models/User')
const { body, validationResult } = require('express-validator');



//Create a User using : POST "/api/auth/". Doesn't require Auth
router.post('/', [
    body('email').isEmail(),
    body('name').isLength({min:3}),
    body('password').isLength({min:5}),

 ] , (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send(req.body);
})

module.exports=router 