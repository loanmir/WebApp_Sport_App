const express = require('express');
const whoami = express.Router();

whoami.get('/', async (req, res, next) => {
        if (req.session && req.session.user){
            const { user_password, ...userWithoutPassword } = req.session.user; // Putting all the user data except the password inside userWithoutPassword
            res.send({
                logged: true,
                user: userWithoutPassword
            });
        }else {
            res.send({logged:false}) // If user doen't exist then we send that there is no logged user
        }
})


module.exports = whoami;