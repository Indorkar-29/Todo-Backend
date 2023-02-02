const express=require('express');
const router=express.Router();
const Todo=require("../models/Todo");
const User=require("../models/User");

router.use(express.json());

const cors=require('cors');
router.use(cors());

const {validate}=require('../middleware/middleware');
const bodyParser=require('body-parser');

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

// CREATE TODO
router.post('/create',validate,cors(),async(req,res)=>{
    try{
        let users=await Todo.find({userId:req.user});
        if(users.length>0){
            users=await Todo.find({userId:req.user}).updateOne({},{$push:{todo:req.body.todo[0]}});
        }else{
            users=await Todo.create({
                todo:req.body.todo[0],
                userId:req.user
            });
        }
        res.status(200).json({
            status:"Success",
            result:users
        });
    }catch(e){
        res.status(400).json({
            status:"Failed",
            error:e.message
        });
    }
});

// GET ALL TODO
router.get("/allTodo",validate,async(req,res)=>{
    try{
        const users=await Todo.find({userId:req.user});
        res.status(200).json({
            users
        });
    }catch(e){
        res.status(400).json({
            error:e.message
        });
    }
});

// GET USER
router.get('/user',validate,async(req,res)=>{
    try{
        const user=await User.findOne({_id:req.user});
        res.status(200).json({
            user
        });
    }catch(e){
        res.status(400).json({
            error:e.message
        });
    }
});

module.exports=router;