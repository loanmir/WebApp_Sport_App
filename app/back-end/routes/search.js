const express = require('express');
const search = express.Router();
const Fields = require('../models/Field');   
const Teams = require('../models/Team');
const Tournaments = require('../models/Tournament');
const Users = require('../models/User');  

// GET /search?q=someText
search.get('/', async (req, res) => {
    try {
        const query = req.query.q;
        
        if (!query) {
            return res.json({ fields: [], teams: [], tournaments: [], users: [] });
        }

        // $regex with 'i' (case-insensitive) matches partial strings
        const regex = { $regex: query, $options: 'i' };

        // Run all 4 queries simultaneously for speed
        const [fields, teams, tournaments, users] = await Promise.all([
            Fields.find({ name: regex }),
            Teams.find({ name: regex }),
            Tournaments.find({ name: regex }),
            // Search users by username OR name OR surname
            Users.find({ 
                $or: [
                    { user_username: regex }, 
                    { user_firstName: regex }, 
                    { user_surname: regex }
                ] 
            })
        ]);

        res.json({ fields, teams, tournaments, users });

    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ error: "Server error during search" });
    }
});

module.exports = search;