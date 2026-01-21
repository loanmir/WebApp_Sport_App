const express= require("express")
const matches = express.Router();
const matchesData = require('../db/matchesData');
const matchModel = require('../models/Match');



matches.get('/:id', async (req, res, next) => {
    try{
        let canEdit = false;
        const userId = req.session.user ? req.session.user._id : null;
        const match = await matchesData.oneMatch(req.params.id);

        if (!match){
            return res.status(404).json({ error: "Match not found" });
        }
        
        console.log(userId + " "+ match.tournament.creator);
        if (userId && match.tournament.creator.equals(userId)){
            canEdit = true;
        }

        // REMEMBER THIS SYNTAX -> Mixes the permission flag directly into the match data -> keeping a flat structure
        res.json({ 
            ...match.toObject(), 
            canEdit: canEdit 
        });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Could not fetch the match" });
    }
})


matches.put('/:id/result', async (req, res, next) => {
    try{

        const userId = req.session.user ? req.session.user._id : null;

        if (!userId){
            console.log("You must be logged in");
            return res.status(401).json({ error: "You must be logged in" });
        }

        const matchExist = await matchModel.findById(req.params.id).populate('tournament'); //get all the tournament data -> To check the creatorID!!!


        if (!matchExist){
            console.log("Match not found");
            return  res.status(404).json({ error: "Match not found" });
        }   

        if (!matchExist.tournament.creator.equals(userId)){
            console.log("Unathorized: You are not the creator of the tournament for this match");
            return res.status(403).json({ error: "Unathorized: You are not the creator of the tournament for this match" });
        }



        const {scoreA, scoreB, isPlayed} = req.body;

        if (scoreA < 0 || scoreB < 0 || scoreA > 150 || scoreB > 150){
            console.log("Invalid data for the scores")
            return res.status(400).json({ error: "Scores must be between 0 and 150" });
        }


        const updateMatch = await matchesData.updateMatchResult(req.params.id, {
            scoreA: scoreA, 
            scoreB: scoreB, 
            played: isPlayed 
        }, {new: true});
        res.json(updateMatch);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Could not update the match result" });
    }
})




module.exports = matches;