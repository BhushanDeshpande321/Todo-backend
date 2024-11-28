import mongoose, { Schema } from 'mongoose';

const TodoSchema = new Schema({
    todo : String ,
    
    isComplete : {
        type : Boolean,
        default : false
    }
})

const TodoModel = mongoose.model('Todo',TodoSchema)

export{TodoModel}