const express= require("express")
const matches = express.Router();
const matchesData = require('../db/matchesData');



matches.get('/:id', async (req, res, next) => {
    try{
        const match = await matchesData.oneMatch(req.params.id);
        res.json(match);

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Could not fetch the match" });
    }
})


matches.put('/:id/result', async (req, res, next) => {
    try{
        const {homeScore, awayScore, isPlayed} = req.body;
        const match = await matchesData.updateMatchResult(req.params.id, {homeScore, awayScore, isPlayed}, {new: true});
        res.json(match);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Could not update the match result" });
    }
})




module.exports = matches;