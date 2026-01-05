const express = require("express")
const app = express()
const port = 8080

// Imports
const noviceRouter = require("./routes/novice");
const connectDB = require('./db/dbConnection');


connectDB();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("This text must be changed to a static file")
});


app.use("/novice", noviceRouter);

///App listening on port
app.listen(process.env.PORT || port, ()=>{
    console.log(`Server is running on port: ${process.env.PORT || port}`)
})