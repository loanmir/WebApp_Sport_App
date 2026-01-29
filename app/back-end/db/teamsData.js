const Teams = require('../models/Team'); 

let dataPool = {};

// GET ALL TEAMS
dataPool.allTeams = async () => {
    try {
        const res = await Teams.find().populate('tournament'); 
        return res;
    } catch (err) {
        throw err;
    }
}

// GET ONE BY ID
dataPool.oneTeam = async (id) => {
    try {
        const res = await Teams.findById(id).populate('tournament');
        return res;
    } catch (err) {
        throw err;
    }
}

// CREATE NEW TEAM
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

// UPDATE TEAM - LINK TO TOURNAMENT
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

dataPool.deleteTeam = async (id) => {
    try{
        const res = await Teams.findByIdAndDelete(id);
        return res;
    }catch(err){
        throw err;
    }
}

module.exports = dataPool;