import mongoose from "mongoose";

export const connectDatabase = async ()=>{
try{
    const {connection} = await mongoose.connect("mongodb+srv://aa:aa@cluster0.d2hao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log(`MongoDB connected : ${connection.host}`)
}catch(error){
    console.log(error)

}

}