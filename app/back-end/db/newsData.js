const News = require('../models/News'); 

let dataPool = {};

// 1. GET ALL
dataPool.allNovice = async () => {
    try {
        const res = await News.find(); 
        return res;
    } catch (err) {
        throw err;
    }
}

// 2. GET ONE BY ID
dataPool.oneNovica = async (id) => {
    try {
        const res = await News.findById(id);
        return res;
    } catch (err) {
        throw err;
    }
}

// 3. CREATE NEW NEWS ITEM
dataPool.createNovica = async (title, slug, text) => {
    try {
        const res = await News.create({
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