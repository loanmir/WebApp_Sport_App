const User = require('../models/User'); 

let dataPool = {};


// Find user by username for authentication
dataPool.AuthUser = async (username) => {
    try {
        // .findOne returns the first document that matches the criteria
        const user = await User.findOne({ user_username: username });
        return user; 
    } catch (err) {
        throw err;
    }
}


// Register a new user
dataPool.AddUser = async (username, password, name, surname) => {
    try {
        const newUser = await User.create({
            user_username: username,
            user_password: password,
            user_firstName: name,
            user_surname: surname
            
        });
        return newUser;
    } catch (err) {
        // Username OR Email already exists
        throw err;
    }
}

// Get all users with optional search query
dataPool.AllUsers = async (queryText) =>{
    try {

        let filter = {};

        if(queryText){
            filter.$or = [
                {user_username: { $regex: "^" + queryText, $options: 'i' } },
                {user_firstName: { $regex: "^" + queryText, $options: 'i' } },
                {user_surname: { $regex: "^" + queryText, $options: 'i' } }
            ];
        }
            const res = await User.find(filter, '-user_password -__v'); // Exclude password and __v fields
            return res;
        } catch (err) {
            throw err;
        }
}

// Get user by ID
dataPool.getUserById = async (id) => {
    try {
        const res = await User.findById(id, '-user_password -__v'); // Exclude password and __v fields
        return res;
    }catch(err){
        throw err;
    }
}

module.exports = dataPool;
