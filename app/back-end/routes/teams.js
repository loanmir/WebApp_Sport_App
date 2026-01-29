const express= require("express")
const teams = express.Router();
const teamsData = require('../db/teamsData');
const tournamentsData = require('../db/tournamentsData');


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


// Updating a team -> Assigning it to a tournament
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


// Creating a new team
teams.post('/', async (req, res, next) => {
    try {
        const { name, players } = req.body;
        
        // Validation
        if (!name) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newEntry = await teamsData.createTeam(name, players, req.session.user._id);
        
        res.status(201).json(newEntry);
        console.log("New team created:", newEntry);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating team");
    }
});


// Adding a player to an existing team
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

// Deleting a team
teams.delete('/:id', async (req, res, next) => {
    try {
        if (!req.session.user){
            return res.status(401).json({ error: "Unauthorized" });
        }

        const teamId = req.params.id;
        const userId = req.session.user._id;

        // Check if the user is the creator of the team
        const team = await teamsData.oneTeam(teamId);
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (team.creator.toString() !== userId) {
            return res.status(403).json({ error: "You are not the creator of this team" });
        }

        // Checking if team is in an active tournament
        if (team.tournament) {
            const tournament = await tournamentsData.oneTournament(team.tournament);

            if (tournament && (tournament.status === "Active" || tournament.status === "Completed")) {
                return res.status(409).json({ 
                    error: "Cannot delete this team. It is part of an active or completed tournament." 
                });
            }
        }

        await teamsData.deleteTeam(teamId);
        res.json({ message: "Team deleted successfully" });
            
    }catch (err){
        console.error(err);
        res.status(500).send("Error deleting team");
    }
})


module.exports=teams