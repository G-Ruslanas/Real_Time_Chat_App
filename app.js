const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http);


app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect("mongodb://localhost:27017/chatDB");

const messageSchema = {
    name: String,
    message: String
  };
  
const Message = mongoose.model("Message", messageSchema);

app.get("/messages", function(req,res){
    Message.find({}, function(err, messages){
        res.send(messages);
    })
});

app.post("/messages", function(req,res){
    var message = new Message(req.body);
    message.save(function(err){
        if(err)
            sendStatus(500);
        io.emit("message", req.body)
        res.sendStatus(200)
    })
});

io.on('connection', function(){
    console.log('a user is connected')
   })

http.listen(3000, function(){
    console.log("Server is running on port 3000");
})