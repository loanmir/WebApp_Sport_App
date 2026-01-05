const User = require('../models/User'); 

let dataPool = {};


// FIND USER BY THE USERNAME
dataPool.AuthUser = async (username) => {
    try {
        // .findOne returns the first document that matches the criteria
        const user = await User.findOne({ user_name: username });
        return user; 
    } catch (err) {
        throw err;
    }
}


// REGISTER A NEW USER
dataPool.AddUser = async (username, email, password) => {
    try {
        const newUser = await User.create({
            user_name: username,
            user_email: email,
            user_password: password
        });
        return newUser;
    } catch (err) {
        // Username OR Email already exists
        throw err;
    }
}

module.exports = dataPool;
