const express= require("express")
const users = express.Router();
const userData = require('../db/userData');


//users.get("/login", (req, res, next) => {
   // if(req.session.user){
        //res.send({
          //  logged:true,
           // user: req.session.user
       // })
    //} else{
    //    res.send({logged:false}) // If user doen't exist then we send that there is no logged user
    //}
//})


// USER LOGIN 
users.post('/signin', async (req, res, next) => {
    const { username, password  } = req.body;

    // CHECKING IF USERNAME AND PASSWORD ARE PROVIDED
    if (!username || !password) {
        return res.status(400).json({ error: "Please enter Username and Password!" });
    }

    try {
        // Mongoose returns 'null' if not found, or the User object if found.
        // It does NOT return an array like MySQL.
        const user = await userData.AuthUser(username);

        if (user) {
            // CHECKING THE PASSWORD - IF IT IS CORRECT FOR THAT ONE USER
            const userFromDoc = await user.toObject();

            if (password === user.user_password) {
                
                const { user_password, ...userWithoutPassword } = userFromDoc; // Exclude password from session data
                
                if (req.session) {
                    req.session.user = userWithoutPassword;
                    console.log("SESSION VALID:", req.session.user);
                }

                // Send success response
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




// USER REGISTRATION
users.post('/signup', async (req, res, next) => {
    // Trimming to remove accidental spaces
    const username = req.body.username?.trim();
    const password = req.body.password;
    const name = req.body.name?.trim();
    const surname = req.body.surname?.trim();

    // CHECKING IF ALL FIELDS ARE PROVIDED
    if (!username || !password || !name || !surname) {
        console.log("A field is missing!");
        return res.status(400).json({ error: "Missing username, password, name, or surname" });
    }

    try {
        // INSERTING THE NEW USER INTO THE DATABASE
        const newUser = await userData.AddUser(username, password, name, surname);
        
        // If code reaches here, it succeeded (otherwise catch block runs)
        console.log("New user added!!");
        
        // Return 201 Created and the new user data
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