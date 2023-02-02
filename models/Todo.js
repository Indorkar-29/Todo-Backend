const mongoose=require('mongoose');

const TodoSchema=new mongoose.Schema({
    todo:[{
        activity:String
    }],
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
});

const TodoModel=new mongoose.model("todo",TodoSchema);

module.exports=TodoModel;