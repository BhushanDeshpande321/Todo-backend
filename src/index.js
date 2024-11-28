import e from "express";
import { connectDB } from "./services/connDB.services.js";
import { TodoModel } from "./models/todo.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors";

dotenv.config({
    path: "./.env"
})

const app = e();
app.use(cors())
app.use(e.json());

connectDB();

app.post('/', async function(req, res){
    const { todo } = req.body;

    const sendTodo = await TodoModel.create({
        todo
    });

    if(!sendTodo){
        return res
                .status(400)
                .json({
                    message: "Could'nt create the todo"
                })
    }

    res
    .status(200)
    .json({
        todo,
        message: "Todo created successfully"
    });
});

app.get('/', async function(req, res){
    const todos = await TodoModel.find({});

    if(!todos){
        return res
                .status(404)
                .json({
                    message: "No todos found"
                });
    }

    res
    .status(200)
    .json({
        todos,
        message: "Todos fetched successfully"
    });
});

app.put('/', async function (req, res) {
    const {todoId, todo} = req.body

    if(!mongoose.isValidObjectId(todoId)){
        return res
                .status(400)
                .json({
                    message: "Invalid Todo ID"
                });
    }

    const findTodo = await TodoModel.findByIdAndUpdate(todoId, {todo}, {new: true})

    if(!findTodo){
        return res
                .status(404)
                .json({
                    message: "No todo with this ID found"
                });
    }

    res
    .status(200)
    .json({
        data: {
            todo: findTodo.todo,
            isComplete: findTodo.isComplete
        },
        message: "Todo updated successfully"
    });
})

app.delete('/delete/:todoId', async function(req, res){
    const {todoId} = req.params;

    if(!mongoose.isValidObjectId(todoId)){
        return res
                .status(400)
                .json({
                    message: "Invalid Todo ID"
                })
    }

    const deletedTodo = await TodoModel.findByIdAndDelete(todoId)

    if(!deletedTodo){
        return res
                .status(404)
                .json({
                    message: "No Todo with this ID found"
                })
    }

    res
    .status(200)
    .json({
        data: {
            todo: deletedTodo.todo
        },
        message: "Todo deleted successfully"
    })
})

//TODO: Create an endpoint to toggle isComplete entry of a todo.
app.patch("/toggle", async function(req, res) {
    const { todoId } = req.body;
    
    if(!mongoose.isValidObjectId(todoId)){
        return res
               .status(400)
               .json({
                    message: "Invalid Todo ID"
                });
    }

    const findTodo = await TodoModel.findById(todoId);

    if(!findTodo){
        return res
               .status(404)
               .json({
                    message: "No todo with this ID found"
                });
    }

    findTodo.isComplete =!findTodo.isComplete;
    await findTodo.save();

    res
       .status(200)
       .json({
            data: {
                todo: findTodo.todo,
                isComplete: findTodo.isComplete
            },
            message: "Todo is complete status toggled successfully"
        });

})


app.listen(3000,function(){
    console.log("Server is running on port 3000");
});
