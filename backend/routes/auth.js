const express = require('express')
const router = express.Router() 
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');


const JWT_SECRET = 'Sidisagoodb$oy';


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

      const salt=await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password,salt) 

    
      // Create new in user database 
       user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })

      const data = {
        user : {
          id: user.id
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET)
      res.json({authToken})

    }catch(error){
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
})

// Authenticate a User using POSt: "/api/auth/login" .
router.post('/login', [
  body('email','Enter valid email').isEmail(),
  body('password','Password cannot be blank').exists(),
] , async (req,res)=>{

   // if there any error return bad request 404 with array of erroe
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

  const {email , password} = req.body;
  
  try{
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error : "Please Login with correct credentials!"  })

      }

      const passwordCompare= await bcrypt.compare(password,user.password)
      if(!passwordCompare){
        return res.status(400).json({error : "Please Login with correct credentials!"  })
      }

      const data = {
        user : {
          id: user.id
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET)
      res.json({authToken})  

  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

})

module.exports=router  