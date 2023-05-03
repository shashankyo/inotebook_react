const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Harryisagoodboy';

//Route:1 Create a user using: POST "/api/auth/createuser". login not required


router.post('/createuser',[
    body('name','Enter a Valid Name').isLength({ min: 3}),
    body('email','Enter a Valid Email').isEmail(),
    body('password','Password must contain 5 characters').isLength({ min: 5}),
//async function or else error since it is a promise
], async(req,res)=> {
    let success = false;
    //If there are errors, return Bad request and the error
   const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.status(400).json({ success,errors:errors.array() })
   }
   //check whether the user email exists already
   try{

   //Checking whether a user already exist in database
   let user = await User.findOne({email: req.body.email});
   if(user){
    return res.status(400).json({success, error:"Soory a user email is already exists"})
   }

   const salt =  await bcrypt.genSalt(10);

   const secPass = await bcrypt.hash(req.body.password, salt)
   //Create a new user
   user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: secPass,

   });
   
//    .then(user => res.json(user))
//    .catch(err=> {console.log(err)
//     res.json({error: 'Please enter unique value for email', message: err.message})})
// })
        const data = {
            user:{
                id: user.id

            }
        }
    const authtoken = jwt.sign(data, JWT_SECRET);
    // console.log(jwtData);
    success = true;
    res.json({success, authtoken})

    //Catch errors
    } catch(error){
        console.error(error.message);
        //In caseof any sudden error in database
        res.status(500).send("Some error occured");
    }
    })

    //Route:2 authenticate a user 
    router.post('/login',[
        body('email','Enter a Valid Email').isEmail(),
        body('password','Password Cannot be blank').exists(),

    ], async(req,res)=> {

    //If there are errors, return Bad request and the error

        const errors = validationResult(req);
        if(!errors.isEmpty()){
         return res.status(400).json({ errors:errors.array() })
        }

        const {email, password} = req.body;

        try{
            let user = await User.findOne({email});
            if(!user){
                return res.status(400).json({error: "Please try to login with proper credentials"});
            }
        
        const passwordCompare = await bcrypt.compare(password, user.password);

        if(!passwordCompare){
            return res.status(400).json({error: "Please try to login with proper credentials"});

        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({authtoken})

        }catch(error){
            console.error(error.message);
            //In caseof any sudden error in database
            res.status(500).send("Internal server error Some error occured");
        }
    });

    //Route:3 Get logged in users details POST: /api/auth/getuser
    router.post('/getuser',fetchuser ,async(req,res)=> {

        try{
            userId = req.user.id;
            const user = await User.findById(userId).select("-password")
            res.send(user)
        }catch(error){
            console.log(error.message);
            res.status(500).send("Internal server error");
        }
    
    })

    
    
    module.exports = router
