const Fields = require('../models/Field'); 

let dataPool = {};

// 1. GET ALL TEAMS
dataPool.allFields = async (queryText, sportFilter) => {
    try {
        let filter = {};

        if (sportFilter) {
            filter.sport = sportFilter;
        }

        if (queryText) {
            filter.name = { $regex: queryText, $options: 'i' }; // Case-insensitive
        }

        const res = await Fields.find(filter); 
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