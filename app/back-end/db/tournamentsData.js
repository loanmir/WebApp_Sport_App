const Tournaments = require('../models/Tournament'); 

let dataPool = {};

// 1. GET ALL TEAMS
dataPool.allTournaments = async () => {
    try {
        const res = await Tournaments.find(); 
        return res;
    } catch (err) {
        throw err;
    }
}

// 2. GET ONE BY ID
dataPool.oneTournament = async (id) => {
    try {
        const res = await Tournaments.findById(id);
        return res;
    } catch (err) {
        throw err;
    }
}

// 3. CREATE NEW TOURNAMENT
dataPool.createTournament = async (name, sport, startDate, maxTeams, creator) => {
    try {
        const res = await Tournaments.create({
            name: name,
            sport: sport,
            startDate: startDate,
            maxTeams: maxTeams,
            creator: creator,
            status: "Open"
        });
        return res;
    } catch (err) {
        throw err;
    }
}


dataPool.deleteTournament = async (id) => {
    try{
        const res = await Tournaments.findByIdAndDelete(id);
        return res;
    } catch (err) {
        throw err;
    }
}

module.exports = dataPool;