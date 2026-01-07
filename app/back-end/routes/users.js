const express= require("express")
const users = express.Router();
const userData = require('../db/userData');


// USER LOGIN 
users.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // CHECKING IF USERNAME AND PASSWORD ARE PROVIDED
    if (!username || !password) {
        return res.status(400).json({ error: "Please enter Username and Password!" });
    }

    try {
        // 2. Fetch user from MongoDB
        // Mongoose returns 'null' if not found, or the User object if found.
        // It does NOT return an array like MySQL.
        const user = await userData.AuthUser(username);

        if (user) {
            // CHECKING THE PASSWORD - IF IT IS CORRECT FOR THAT ONE USER
            
            if (password === user.user_password) {
                
                // SETTING UP THE SESSION
                // (Requires express-session middleware in app.js)          !!!!!!!!!!!
                if (req.session) {
                    req.session.user = user;
                    console.log("SESSION VALID:", req.session.user);
                }

                // Send success response
                return res.json({ message: "Login successful", user: user });
            } else {
                console.log("INCORRECT PASSWORD");
                return res.status(401).json({ error: "Incorrect password" });
            }
        } else {
            console.log("USER NOT REGISTERED");
            return res.status(404).json({ error: "User not registered" });
        }
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});


// USER REGISTRATION
users.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // CHECKING IF ALL FIELDS ARE PROVIDED
    if (!username || !password || !email) {
        console.log("A field is missing!");
        return res.status(400).json({ error: "Missing username, password, or email" });
    }

    try {
        // INSERTING THE NEW USER INTO THE DATABASE
        const newUser = await userData.AddUser(username, email, password);
        
        // If code reaches here, it succeeded (otherwise catch block runs)
        console.log("New user added!!");
        
        // Return 201 Created and the new user data
        return res.status(201).json({ 
            message: "User registered successfully", 
            user: newUser 
        });

    } catch (err) {
        console.error(err);
        // MongoDB throws code 11000 if username/email is duplicate
        //if (err.code === 11000) {
             //return res.status(409).json({ error: "Username or Email already exists" });
        //}
        return res.sendStatus(500);
    }
});

module.exports=users;