const Matches = require('../models/Match'); 

let dataPool = {};

// Get match by ID
dataPool.oneMatch = async (id) => {
    try{
        const res = await Matches.findById(id)
            .populate('teamA', 'name')
            .populate('teamB', 'name')
            .populate('tournament', 'creator name')
        return res;
    }catch(err){
        throw err;
    }
}

// Update match result/status
dataPool.updateMatchResult = async (id, resultData, options={}) => {
    try{
        const res  = await Matches.findByIdAndUpdate(id, resultData, options);
        return  res;
    }catch(err){
        throw err;
    }
}


module.exports = dataPool;