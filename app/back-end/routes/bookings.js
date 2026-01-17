const express= require("express")
const bookings = express.Router();
const bookingsData = require('../db/bookingsData');



bookings.get('/', async (req, res, next) => {
    try{
        const {field, date} = req.query;

        if (!field || !date) {
            return res.status(400).json({ error: "Missing required query parameters: field and date" });
        }

        const foundBooking = await bookingsData.getBookingsByFieldAndDate(field, date);
        res.json(foundBooking);
    } catch(err){
        console.error(err);
        res.status(500).json({ error: "Error fetching bookings" });
    }
})



bookings.post('/', async (req, res, next) => {
    try{
        const { field, date, slotTime } = req.body;
        const today = new Date().toISOString().split('T')[0]; // get today's date in "YYYY-MM-DD" format
        
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Unauthorized: Please log in." });
        }

        const userID = req.session.user._id;

        
        if (!field || !date || !slotTime) {
            return res.status(400).json({ error: "Missing required fields: field, date, slotTime" });
        }

        if (date < today) {
            return res.status(400).json({ error: "You cannot book a field in the past!" });
        }

        const findBooking = await bookingsData.getBookingsByFieldAndDateAndSlotTime(
            field,
            date,
            slotTime
        );
        
        // Check if such booking already exists
        if(findBooking){
            return  res.status(409).json({ error: "This time slot is already booked." });
        }

        const newBooking = await bookingsData.createBooking(
            field,
            date,
            slotTime,
            userID
        );

        console.log("New Booking Created:", newBooking);
        res.status(201).json(newBooking);

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Error creating booking" });
    }
})

module.exports=bookings