const express= require("express")
const novice = express.Router();
const newsData = require('../db/newsData');


// Getting all the news
novice.get('/', async (req, res, next) => {
    try {
        console.log("Fetching all news...");
        const results = await newsData.allNovice();
        res.json(results);
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching news");
    }
});

// Getting one specific news item by ID
novice.get('/:id', async (req, res, next) => {
    console.log(req.params)
    try {
        const result = await newsData.oneNovica(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).send("Error fetching specific news");
    }
});

novice.post('/', async (req, res, next) => {
    try {
        const { title, slug, text } = req.body;
        
        // Simple validation
        if (!title || !slug || !text) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Call the helper function from newsData.js
        const newEntry = await newsData.createNovica(title, slug, text);
        
        // Return 201 (Created)
        res.status(201).json(newEntry);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating news");
    }
});

module.exports=novice