const Tournaments = require('../models/Tournament'); 

let dataPool = {};

// Get all tournaments 
dataPool.allTournaments = async (queryText, statusFilter) => {
    try {
        let filter = {};

        if (statusFilter){
            filter.status = statusFilter;
        }

        if (queryText){
            filter.name = {
                $regex: queryText, $options: 'i'  // Case-insensitive
            }
        }

        const res = await Tournaments.find(filter); 
        return res;
    } catch (err) {
        throw err;
    }
}

// Get one tournament by ID
dataPool.oneTournament = async (id) => {
    try {
        const res = await Tournaments.findById(id);
        return res;
    } catch (err) {
        throw err;
    }
}

// Create a new tournament
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

// Delete a tournament by ID
dataPool.deleteTournament = async (id) => {
    try{
        const res = await Tournaments.findByIdAndDelete(id);
        return res;
    } catch (err) {
        throw err;
    }
}

// Edit a tournament by ID
dataPool.editTournament = async (id, newData) => {
    try {
        const updatedTournament = await Tournaments.findByIdAndUpdate(
            id,
            newData,
            { new: true } // this option tells mongoose to return the modified document
        );
        return updatedTournament;
    } catch (err) {
        throw err;
    }
}

module.exports = dataPool;