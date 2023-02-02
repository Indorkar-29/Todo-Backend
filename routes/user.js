const router=require('express').Router();
const bcrypt=require('bcrypt');
const User=require('../models/User');
const {body,validationResult}=require('express-validator');
const jwt=require("jsonwebtoken");
const dotenv=require('dotenv');
dotenv.config();

router.use(require('express').json());

// REGISTER
router.post('/register',body('email').isEmail(),body('password').isLength(min=6,max=12),async(req,res)=>{
    const {email,password}=req.body;
    try{
        const error=validationResult(req);
        if(!error.isEmpty()){
            res.status(500).json({error:error.array()});
        }
        const data=await User.findOne({email});
        if(data){
            return res.status(400).json({
                error:`User already exists with ${email} this Email Id, try with another Email Id`
            });
        }
        bcrypt.hash(password,12,async(err,hash)=>{
            if(err){
                return res.status(400).json({error:err.message});
            }
            const user=await User.create({email,password:hash});
            res.status(200).json({
                status:"Success",
                message:"Registered Successfully",
            });
        });
    }catch(e){
        res.status(500).json({
            status:"Failed",
            message:e.message
        });
    }
});

// LOGIN
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const userData=await User.findOne({email});
    if(userData != null){
        const result=await bcrypt.compare(password,userData.password);
        if(result){
            const token=jwt.sign(
                {
                    exp:Math.floor(Date.now()/10)+60*60,
                    data:userData._id
                },
                process.env.SECRET
            );
            res.status(200).json({
                status:"Success",
                message:"Login Successfully",
                token:token 
            });
        }else{
            res.status(400).json({
                status:"Failed",
                message:"Invalid Credentials"
            });
        }
    }else{
        res.status(400).json({
            status:"Failed",
            message:"User Not Found"
        });
    }
});

module.exports=router;