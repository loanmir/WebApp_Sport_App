const express= require("express")
const tournaments = express.Router();
const tournamentsData = require('../db/tournamentsData');
const teamModel = require('../models/Team');


tournaments.get('/', async (req, res, next) => {
    try {
        console.log("Fetching all tournaments...");
        const results = await tournamentsData.allTournaments();
        res.json(results);
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching tournaments");
    }
});

// Getting one specific news item by ID
tournaments.get('/:id', async (req, res, next) => {
    try {
        const result = await tournamentsData.oneTournament(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).send("Error fetching specific tournament");
    }
});

tournaments.post('/', async (req, res, next) => {
    try {

        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Unauthorized: You must be logged in to create a tournament." });
        }

        const creatorId = req.session.user._id;
        const { name, sport, startDate, maxTeams } = req.body;
        
        // Simple validation
        if (!name || !sport || !startDate || !maxTeams) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Call the helper function from tournamentsData.js
        const newEntry = await tournamentsData.createTournament(name, sport, startDate, maxTeams, creatorId);
        
        // Return 201 (Created)
        res.status(201).json(newEntry);
        console.log("New tournament created:", newEntry);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating tournament");
    }
});


tournaments.delete('/:id', async (req, res, next) => {
    try{
        const tournamentId = req.params.id;
        const userId = req.session.user ? req.session.user._id : null;
        // Check if user is logged in
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        
        const tournament = await tournamentsData.oneTournament(tournamentId); 
        // Security check: If the tournament exists
        if (!tournament) return res.status(404).json({ error: "Tournament not found" });

        // 2. Check ownership
        if (tournament.creator.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not the creator of this tournament" });
        }

        await teamModel.updateMany(
            { tournament: tournamentId },
            { $set: {tournament: null}}
        ); 

        // 3. Delete it
        await tournamentsData.deleteTournament(tournamentId);
        res.json({ message: "Tournament deleted successfully" });
    }catch (err) {
        console.error(err);
    }
});


tournaments.get('/:id', async (req, res) => {
    try {
        const t = await tournamentsData.oneTournament(req.params.id);
        if (!t) return res.status(404).json({ error: "Not found" });
        res.json(t);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


tournaments.put('/:id', async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const userId = req.session.user ? req.session.user._id : null;

        // Security: First checking the login
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        // Checking if model exists
        const tournament = await tournamentsData.oneTournament(tournamentId);
        if (!tournament) return res.status(404).json({ error: "Not found" });

        // Checking if current users owns the tournament
        if (tournament.creator.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Forbidden: You are not the creator" });
        }

        
        const updates = {
            name: req.body.name,
            sport: req.body.sport,
            maxTeams: req.body.maxTeams,
            status: req.body.status 
        };

        const updated = await tournamentsData.editTournament(tournamentId, updates);
        res.json(updated);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports=tournaments