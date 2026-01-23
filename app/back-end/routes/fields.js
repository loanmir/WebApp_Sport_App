const express= require("express")
const fields = express.Router();
const fieldsData = require('../db/fieldsData');


// Getting all the news
fields.get('/', async (req, res, next) => {
    try {

        const {q, sport} = req.query;
        console.log("Searching fields... Query: "+q+", Sport: "+sport);
        
        const results = await fieldsData.allFields(q, sport);
        res.json(results);
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching fields");
    }
});

// Getting one specific field by ID
fields.get('/:id', async (req, res, next) => {
    try {
        const result = await fieldsData.oneField(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).send("Error fetching specific field");
    }
});

fields.post('/', async (req, res, next) => {
    try {
        const { name, sport, address, bookableSlots } = req.body;
        
        // Simple validation
        if (!name || !sport || !address || !bookableSlots) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Call the helper function from fieldsData.js
        const newEntry = await fieldsData.createField(name, sport, address, bookableSlots);
        
        // Return 201 (Created)
        res.status(201).json(newEntry);
        console.log("New field created:", newEntry);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating field");
    }
});

module.exports=fields