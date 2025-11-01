

const express = require("express")
const cors = require("cors")
const app = express();
const bodyParser = require("body-parser")
const adminRoute = require("./route/adminRoute")
const userRoute = require("./route/userRoute")
const  mongoose = require("mongoose");

app.use(cors())
app.use(bodyParser.json());
// app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/cybromTask").then(()=>{
    console.log("connected DB")
})
app.use(express.json())

app.use("/admin",adminRoute)
app.use("/user",userRoute)

// Parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));














app.listen(1000,()=>{
    console.log("port running on 1000")
})