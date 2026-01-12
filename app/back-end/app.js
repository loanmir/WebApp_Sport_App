const express = require("express")
const app = express()
const port = 8080
const cors = require("cors");
const cookieParser = require("cookie-parser");


// Imports
const teamsRouter = require("./routes/teams");
const usersRouter = require("./routes/users");
const connectDB = require('./db/dbConnection');


connectDB();

app.use(express.json()); //JSON parsing directive so that front-end can send JSON data to the back-end -> TAKE A LOOK AGAIN
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET","POST"],
    credentials: true
}));
app.use(cookieParser("somesecret"));


app.get("/",(req,res)=>{
    res.send("This text must be changed to a static file")
});


app.use("/teams", teamsRouter);
app.use("/users", usersRouter);


///App listening on port
app.listen(process.env.PORT || port, ()=>{
    console.log(`Server is running on port: ${process.env.PORT || port}`)
})