import mongoose from "mongoose";


const TicketSchema = new mongoose.Schema({
      type :{
        type : Number , 
        required:true
       },
      title :{
        type : String , 
        required:true
       },
       ticket_price : {
         type : Number,
         required: true,
       },
       capacity : {
         type: Number,
         default: false ,
       }
                 
}
)


export const Ticket = mongoose.model("Ticket" , TicketSchema);