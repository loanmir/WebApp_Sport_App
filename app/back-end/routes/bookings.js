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


bookings.get('/user', async (req, res, next) => {
    try{
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Unauthorized: Please log in." });
        }
        const userID = req.session.user._id;

        const userBookings = await bookingsData.getBookingsByUser(userID);

        res.json(userBookings);

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Error fetching user bookings" });
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
        // 11000 is MongoDB code for duplicate key error -> REMEMBER Booking collection schema
        if (err.code === 11000){
            return res.status(409).json({ error: "This time slot is already booked." });
        }

        console.error(err);
        res.status(500).json({ error: "Error creating booking" });
    }
})




bookings.delete('/:id', async (req, res, next) => {
    try{
        const bookingID =  req.params.id;

        // Checking if the user is actually logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Unauthorized: Please log in." });
        }

        const userID = req.session.user._id;

        const bookingToDelete = await bookingsData.getBookingByID(bookingID);

        //Check if desired booking actually exists
        if(!bookingToDelete){
            return res.status(404).json({ error: "Booking not found" });
        }

        //  checking if booking is actually owned by current user 
        if(bookingToDelete.user.toString() !== userID){
            return res.status(403).json({ error: "You are not allowed to delete this booking." });
        }

        await bookingsData.deleteBooking(bookingID);
        res.status(200).json({ message: "Booking cancelled successfully" });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Error cancelling booking" });
    }
});

module.exports=bookings