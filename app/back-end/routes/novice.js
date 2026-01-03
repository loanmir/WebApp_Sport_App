const express= require("express")
const novice = express.Router();

novice.get('/',(req,res)=>{
console.log("The route Novice has been reached")
res.send("noviceeeee")
})

module.exports=novice