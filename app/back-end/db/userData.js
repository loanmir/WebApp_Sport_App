const User = require('../models/User'); 

let dataPool = {};


// FIND USER BY THE USERNAME
dataPool.AuthUser = async (username) => {
    try {
        // .findOne returns the first document that matches the criteria
        const user = await User.findOne({ user_username: username });
        return user; 
    } catch (err) {
        throw err;
    }
}


// REGISTER A NEW USER
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

dataPool.AllUsers = async () =>{
    try {
            const res = await User.find({}, '-user_password -__v'); // Exclude password and __v fields
            return res;
        } catch (err) {
            throw err;
        }
}

module.exports = dataPool;
