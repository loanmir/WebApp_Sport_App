const express= require("express")
const users = express.Router();
const userData = require('../db/userData');


// Login 
users.post('/signin', async (req, res, next) => {
    const { username, password  } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Please enter Username and Password!" });
    }

    try {
        // Mongoose returns 'null' if not found, or the User object if found.
        // It does NOT return an array like MySQL.
        const user = await userData.AuthUser(username);

        if (user) {
            // Checking if password is correct -> Future work: "bcrypt" hashing
            const userFromDoc = await user.toObject();

            if (password === user.user_password) {
                
                const { user_password, ...userWithoutPassword } = userFromDoc; // Exclude password from session data
                
                if (req.session) {
                    req.session.user = userWithoutPassword;
                    console.log("SESSION VALID:", req.session.user);
                }

                return res.json({ message: "Login successful", user: userWithoutPassword });
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




// Register
users.post('/signup', async (req, res, next) => {
    // Trimming to remove accidental spaces
    const username = req.body.username?.trim();
    const password = req.body.password;
    const name = req.body.name?.trim();
    const surname = req.body.surname?.trim();

    if (!username || !password || !name || !surname) {
        console.log("A field is missing!");
        return res.status(400).json({ error: "Missing username, password, name, or surname" });
    }

    try {
        // Inserting the new user into the database
        const newUser = await userData.AddUser(username, password, name, surname);
        
        console.log("New user added!!");
        
        return res.status(201).json({ 
            message: "User registered successfully", 
            user: newUser 
        });

    } catch (err) {
        console.error("Registration error:", err);
        // MongoDB throws code 11000 for duplicates
        if (err.code === 11000) {
             return res.status(409).json({ error: "Username is already taken. Please choose another." });
        }
        return res.sendStatus(500).json({error: "Internal server error"});
    }
});


// Logout
users.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Could not log out.");
        }
        res.clearCookie('sport_app_session', { path: '/' });  // this is default cookie name -> Found on "expressjs.com"

        // 3. Send success response
        return res.json({ message: "Logout successful" });
    });
})


// Get all users
users.get("/", async (req, res, next) => {
    try {
        const q = req.query.q;
        console.log("Query param:", q);

        const results = await userData.AllUsers(q);
        res.json(results);
                
    }catch (err) {
        console.error(err);
        res.status(500).json("Error retrieving users");
    }
});


// Get user by ID
users.get("/:id", async (req, res, next) => {
    try {
        const result = await userData.getUserById(req.params.id);
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(500).json("Error retrieving user");
    }
});


module.exports=users;