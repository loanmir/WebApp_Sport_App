const express = require("express")
const app = express()
const port = 8080
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");


// Imports
const teamsRouter = require("./routes/teams");
const usersRouter = require("./routes/users");
const fieldsRouter = require("./routes/fields");
const tournamentsRouter = require("./routes/tournaments");
const bookingsRouter = require("./routes/bookings");
const searchRouter = require("./routes/search");
const matchesRouter = require("./routes/matches");
const connectDB = require('./db/dbConnection');


connectDB();



app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET","POST", "PUT", "DELETE"],
    credentials: true
}));


app.use(express.json()); //JSON parsing directive so that front-end can send JSON data to the back-end -> TAKE A LOOK AGAIN
app.use(express.urlencoded({ extended: true }));

// CHECK AGAIN THIS session.parameters!!! -> TAKE A LOOK AT THE MEANING
app.use(session({
    secret: "somesecret",
    name: "sport_app_session",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 2 // 2 minutes
    }
}))

app.use(cookieParser("somesecret"));


app.get("/",(req,res)=>{
    res.send("This text must be changed to a static file")
});


app.use("/teams", teamsRouter);
app.use("/users", usersRouter);
app.use("/fields", fieldsRouter);
app.use("/tournaments", tournamentsRouter);
app.use("/bookings", bookingsRouter);
app.use("/search", searchRouter);
app.use("/matches", matchesRouter);


///App listening on port
app.listen(process.env.PORT || port, ()=>{
    console.log(`Server is running on port: ${process.env.PORT || port}`)
})