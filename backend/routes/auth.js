const express = require('express')
const router = express.Router() 
const User = require('../models/User')
const { body, validationResult } = require('express-validator');



//Create a User using : POST "/api/auth/createUser". Doesn't require Auth
router.post('/createUser', [
    body('email').isEmail(),
    body('name').isLength({min:3}),
    body('password').isLength({min:5}),

 ] , async (req,res)=>{
  // if there any error return bad request 404 with array of erroe
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check whether the user with same email exists or not
    try{
      let user = await User.findOne({email:req.body.email});
      if(user){
          return res.status(400).json({error:"Sorry! User with the same email already exists"})
      }
       user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
      
      res.json(user)
    }catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
   
})

module.exports=router 