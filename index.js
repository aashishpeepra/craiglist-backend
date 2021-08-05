require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors")
const express = require("express");


const server = express();
server.use(express.json())
server.use(express.urlencoded({extended:true}));
server.use(cors());

const postRouter = require("./routes/post");

server.use(postRouter)

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
  }).then(()=>{
    server.listen(PORT);
    console.log(`connected to mongoDB at port ${PORT} at ${Date.now()}`)
}).catch(err=>{
    console.error(err)
})

