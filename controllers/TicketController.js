import { Ticket } from "../models/Ticket.js";

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const getTicketById = async (req, res) => {
    const id = req.params.id ;
    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        res.status(200).json(ticket);
    }catch(error){
        res.status(500).json({ error: error })
    }

}

export const createTicket = async (req, res) => {
try{
    const { title, ticket_price, capacity, type } = req.body ;
    if(!title ||!ticket_price ||!capacity ||!type) {
        return res.status(400).json({ message: "All fields are required" }); 
    } 
    if(capacity<0){
        return res.status(400).json({ message: "Capacity must be positive" });
    }
    if(type <1 && type >3){
        return res.status(400).json({ message: "Invalid type" });
    }
    const newTicket = new Ticket({ title, ticket_price, capacity, type });
    await newTicket.save();
    res.status(201).json(newTicket);
}catch(error){
    res.status(500).json({ message: error.message })
}
}

export const updateTicket = async (req, res) => {
    const id = req.params.id ;
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTicket) return res.status(404).json({ message: "Ticket not found" });
        res.status(200).json(updatedTicket);
    } catch(error){
        res.status(500).json({ error: error })
    }
}

export const deleteTicket = async (req, res) => {
    const id = req.params.id ;
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(id);
        if (!deletedTicket)
             return res.status(404).json({ message: "Ticket not found" });
        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch(error){
        res.status(500).json({ error: error })
    }
}

export const buyTickets = async (req, res) => {
    const id = req.params.id ;
    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        if (ticket.capacity < 1) {
            return res.status(400).json({ message: "Insufficient tickets" });
        } 
        else 
        {
            ticket.capacity = ticket.capacity - 1;
            await ticket.save();
            res.status(200).json({ message: "Tickets bought successfully", remaining_capacity: ticket.capacity });
        }

    }catch(error){
        res.status(500).json({ message: error.message })
    }
}

export const setDiscount =async (req, res) => {
     const { discount_percentage } = req.body;
        const id = req.params.id;
    try {
        if (!discount_percentage) 
            return res.status(400).json({ message: "Discount percentage is required" });
        if (discount_percentage < 0 || discount_percentage > 100) {
            return res.status(400).json({ message: "Invalid discount percentage" });
        }
        const ticket = await Ticket.findById(id);
        if (!ticket) 
            return res.status(404).json({ message: "Ticket not found" });
        const newPrice = (ticket.ticket_price * discount_percentage ) / 100 ;
        ticket.ticket_price = newPrice;
        await ticket.save();
        res.status(200).json({ticket});
    }catch(error) {
        res.status(500).json({ error: error });
    }
}