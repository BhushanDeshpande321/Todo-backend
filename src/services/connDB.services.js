import mongoose from "mongoose";

async function connectDB() {
    try {
        const instance = await mongoose.connect(process.env.MONGO_URI + "/" + process.env.DB_NAME)
        console.log("😊 MongoDB connected Successfully : HOST "+instance.connection.host);
        
    } catch (error) {
        console.error("😒 MongoDB connection failed ",error)
    }
}
export{
    connectDB
}