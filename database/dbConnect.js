import mongoose from "mongoose";

export const connectDatabase = async ()=>{
try{
    const {connection} = await mongoose.connect(process.env.MONGO_URI ||"mongodb+srv://test:test@cluster0.p9nyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log(`MongoDB connected : ${connection.host}`)
}catch(error){
    console.log(error)

}

}