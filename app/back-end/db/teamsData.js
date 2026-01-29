const Teams = require('../models/Team'); 

let dataPool = {};

// Get all teams
dataPool.allTeams = async () => {
    try {
        const res = await Teams.find().populate('tournament'); 
        return res;
    } catch (err) {
        throw err;
    }
}

// Get one team by ID
dataPool.oneTeam = async (id) => {
    try {
        const res = await Teams.findById(id).populate('tournament');
        return res;
    } catch (err) {
        throw err;
    }
}

// Create a new team
dataPool.createTeam = async (name, players, creator) => {
    try {
        const res = await Teams.create({
            name: name,
            players: players || [],
            creator: creator
        });
        return res;
    } catch (err) {
        throw err;
    }
}

// Update a team by ID -> For the linking to a tournament
dataPool.updateTeam = async (id, newData, options = { new: true }) => {
    try {
        // Mongoose findByIdAndUpdate takes (id, update, options)
        // We pass the 'options' argument through so { new: true } works
        const updatedTeam = await Teams.findByIdAndUpdate(id, newData, options);
        return updatedTeam;
    } catch (err) {
        throw err;
    }
}

// Add a player to a team
dataPool.addPlayerToTeam = async (teamId, playerData) => {
    try {
        const res = await Teams.findByIdAndUpdate(
            teamId,
            { $push: { players: playerData } },
            { new: true }
        );

        return res;
    }catch(err){
        throw err;
    }
}

// Delete a team by ID
dataPool.deleteTeam = async (id) => {
    try{
        const res = await Teams.findByIdAndDelete(id);
        return res;
    }catch(err){
        throw err;
    }
}

module.exports = dataPool;