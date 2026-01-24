const express= require("express")
const teams = express.Router();
const teamsData = require('../db/teamsData');


// Getting all the teams
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

// Getting one specific team by ID
teams.get('/:id', async (req, res, next) => {
    try {
        const result = await teamsData.oneTeam(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).send("Error fetching specific team");
    }
});


// UPDATE TEAM (e.g. Assign to Tournament)
teams.put('/:id', async (req, res) => {
    try {
        const teamId = req.params.id;
        const { tournament } = req.body; // Expecting { tournament: "TOURNAMENT_ID" }

        // Find and Update
        const updatedTeam = await teamsData.updateTeam(
            teamId,
            { tournament: tournament }, 
            { new: true }
        );

        if (!updatedTeam) return res.status(404).json({ error: "Team not found" });

        res.json(updatedTeam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not update team" });
    }
});


teams.post('/', async (req, res, next) => {
    try {
        const { name, players } = req.body;
        
        // Simple validation
        if (!name) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Call the helper function from teamsData.js
        const newEntry = await teamsData.createTeam(name, players, req.session.user._id);
        
        // Return 201 (Created)
        res.status(201).json(newEntry);
        console.log("New team created:", newEntry);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating team");
    }
});



teams.post('/:id/players', async (req, res, next) => {
    try{

        const teamId =  req.params.id;
        const { name, surname, number } = req.body;

        if (!name || !surname || !number) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const updatedTeam = await teamsData.addPlayerToTeam(teamId, { name, surname, number });

        if (!updatedTeam) {
            return res.status(404).json({ error: "Team not found" });
        }
        res.json(updatedTeam);
    }catch(err){
        console.error(err);
        res.status(500).send("Error adding player to team");
    }
})

module.exports=teams