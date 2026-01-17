const Bookings = require('../models/Booking'); 

let dataPool = {};


// Get bookings for a specific field and date
dataPool.getBookingsByFieldAndDate = async (fieldID, date) => {
    try{
        const res = await Bookings.find({ field: fieldID, date: date });
        return res;
    }catch(err){
        throw err;
    }
}


dataPool.getBookingsByFieldAndDateAndSlotTime = async (field, date, slotTime) => {
    try{
        const res = await Bookings.findOne({ field: field, date: date, timeSlot: slotTime });
        return res;
    }catch(err){
        throw err;
    }
}


dataPool.createBooking = async (field, date, slotTime, user) => {
    try{
        const res = await Bookings.create({
            field: field,
            date: date,
            timeSlot: slotTime,
            user: user
        });
        return res;
    }catch(err){
        throw err;
    }
}


module.exports = dataPool;