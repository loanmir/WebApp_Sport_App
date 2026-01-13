const express= require("express")
const teams = express.Router();
const teamsData = require('../db/teamsData');


// Getting all the news
teams.get('/', async (req, res, next) => {
    try {
        console.log("Fetching all teams...");
        const results = await teamsData.allTeams();
        res.json(results);
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching teams");
    }
});

// Getting one specific news item by ID
teams.get('/:id', async (req, res, next) => {
    try {
        const result = await teamsData.oneTeam(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).send("Error fetching specific team");
    }
});

teams.post('/', async (req, res, next) => {
    try {
        const { name, tournament, players } = req.body;
        
        // Simple validation
        if (!name || !tournament) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Call the helper function from teamsData.js
        const newEntry = await teamsData.createTeam(name, tournament, players);
        
        // Return 201 (Created)
        res.status(201).json(newEntry);
        console.log("New team created:", newEntry);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating team");
    }
});

module.exports=teams