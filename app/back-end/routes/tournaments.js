const express= require("express")
const tournaments = express.Router();
const tournamentsData = require('../db/tournamentsData');
const teamModel = require('../models/Team');
const matchModel = require('../models/Match');


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
        const today = new Date().toISOString().split('T')[0]; // get today's date in "YYYY-MM-DD" format
        
        // Simple validation
        if (!name || !sport || !startDate || !maxTeams) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (startDate < today){
            return res.status(400).json({ error: "The start date cannot be in the past!" });
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





tournaments.post('/:id/matches/generate', async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const tournament = await tournamentsData.oneTournament(tournamentId);

        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }
            
        const teams = await teamModel.find({ tournament: tournamentId });

        if (teams.length < 2) {
            return res.status(400).json({ error: "Not enough teams to generate matches." });
        }


        // PREPARING THE ROUND-ROBIN SCHEDULE
        const rotation = teams.map(t => t._id); //array of team IDs

        if (rotation.length % 2 !== 0){     // Taking care of the situation when there is an ODD number of teams
            rotation.push(null); // adding a "null" team -> So called BYE
        }

        const numTeams = rotation.length;
        const numRounds = numTeams - 1;
        const halfSize = numTeams / 2;
        const matches = [];
        
        // The start date is the first day of matches   
        let baseDate = new Date(tournament.startDate);

        for (let round = 0; round < numRounds; round++) {

            const roundDate = new Date(baseDate);
            roundDate.setDate(baseDate.getDate() + (round * 1)); // Matches every day - for now
            
            for (let i = 0; i < halfSize; i++) {
                const t1 = rotation[i];
                const t2 = rotation[numTeams - 1 - i];

                // Create match only if both are real teams -> Ignoring the "null" teams
                if (t1 && t2) {

                    matchDate = new Date(roundDate);

                    const maxVariation = 0; //  =0 since the matches are every day and at a fixed time
                    matchDate.setDate(matchDate.getDate() + maxVariation);

                    const randomHour = 10 + Math.floor(Math.random() * 11); // Random hour between 10 AM and 8 PM (20:00)
                    matchDate.setHours(randomHour, 0, 0, 0);

                    matches.push({
                        tournament: tournamentId,
                        teamA: t1,      
                        teamB: t2,      
                        round: round + 1,
                        field: null,    
                        date: matchDate      
                    });
                }
            } // inner-loop

            rotation.splice(1, 0, rotation.pop()); // Rotating the teams -> So that each team plays against each other
        }// outer-loop

        await matchModel.insertMany(matches);
        res.json({ message: "Matches generated successfully", totalMatches: matches.length });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Error generating matches" });
    }
})




tournaments.get('/:id/matches', async (req, res, next) =>{
    try{
        const tournamentId = req.params.id;
        const matches = await matchModel.find({tournament: tournamentId})
            .populate('teamA', 'name')
            .populate('teamB', 'name')
            .populate('field', 'name')
            .sort({round: 1});

        res.json(matches);

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Error fetching matches" });
    }
});





module.exports=tournaments