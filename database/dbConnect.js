import mongoose from "mongoose";

export const connectDatabase = async ()=>{
try{
    const {connection} = await mongoose.connect("mongodb://localhost:27017/testExam")
    console.log(`MongoDB connected : ${connection.host}`)
}catch(error){
    console.log(error)

}

}