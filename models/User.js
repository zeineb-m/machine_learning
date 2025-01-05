import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
      username :{ 
         type: String,
         required: true,
         minlength: 3,
         maxlength: 30 
        },
       email : {
        type : String , 
        required : true , 
       },
       password : {
         type : String,
         required: true,
         minlength: [8 , "password must be 8 caracteres long"]
       },

       isAdmin : {
         type: Boolean,
         default: false ,
       }
          
}
)


export const User = mongoose.model("User" , userSchema);