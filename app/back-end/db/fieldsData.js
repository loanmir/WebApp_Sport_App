const Fields = require('../models/Field'); 

let dataPool = {};

// 1. GET ALL TEAMS
dataPool.allFields = async () => {
    try {
        const res = await Fields.find(); 
        return res;
    } catch (err) {
        throw err;
    }
}

// 2. GET ONE BY ID
dataPool.oneField = async (id) => {
    try {
        const res = await Fields.findById(id);
        return res;
    } catch (err) {
        throw err;
    }
}

// 3. CREATE NEW TEAM
dataPool.createField = async (name, sport, address, bookableSlots) => {
    try {
        const res = await Fields.create({
            name: name,
            sport: sport,
            address: address,
            bookableSlots: bookableSlots
        });
        return res;
    } catch (err) {
        throw err;
    }
}

module.exports = dataPool;