const Fields = require('../models/Field'); 

let dataPool = {};

// Get all fields
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

// Get one field by ID
dataPool.oneField = async (id) => {
    try {
        const res = await Fields.findById(id);
        return res;
    } catch (err) {
        throw err;
    }
}

// Create a new field
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