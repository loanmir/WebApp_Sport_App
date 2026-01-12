const Teams = require('../models/Teams'); 

let dataPool = {};

// 1. GET ALL TEAMS
dataPool.allTeams = async () => {
    try {
        const res = await Teams.find(); 
        return res;
    } catch (err) {
        throw err;
    }
}

// 2. GET ONE BY ID
dataPool.oneTeam = async (id) => {
    try {
        const res = await Teams.findById(id);
        return res;
    } catch (err) {
        throw err;
    }
}

// 3. CREATE NEW TEAM
dataPool.createTeam = async (title, slug, text) => {
    try {
        const res = await Teams.create({
            title: title,
            slug: slug,
            text: text
        });
        return res;
    } catch (err) {
        throw err;
    }
}

module.exports = dataPool;