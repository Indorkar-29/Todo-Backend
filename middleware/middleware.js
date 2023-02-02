const {verify}=require("jsonwebtoken");
const User=require('../models/User');
const dotenv=require('dotenv');
dotenv.config();

const validate=(req,res,next)=>{
    const tokenHeader=req.header("token");
    if(!tokenHeader){
        return res.status(400).json({error:"User is not Logged in"});
    }
    try{
        verify(tokenHeader,process.env.SECRET,async(err,decode)=>{
            if(err){
                return res.status(400).json({error:"Unauthorized"});
            }
            const user=await User.findOne({_id:decode.data});
            if(user){
                req.user=user._id;
                next();
            }else{
                res.status(400).json({error:"Failed"});
            }
        });
    }catch(e){
        res.status(400).json({error:"Forbidden 🔴🔴"});
    }
}

module.exports={validate};