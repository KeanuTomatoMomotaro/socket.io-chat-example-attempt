"use strict";
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', function(req,res){
    // res.sendFile(__dirname + '/index.html')
    res.sendFile(__dirname + '/index2.html')
})

let numUsers = 0

io.on('connection', function(socket){
    let addedUser = false
    socket.on('new message', function(data){
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        })
    })
    socket.on('add user', function(username){
        if (addedUser) return

        socket.username = username
        ++numUsers
        addedUser = true
        socket.emit('login', {
            username: socket.username,
            numUsers: numUsers
        })
    })
    socket.on('typing', function(){
        socket.broadcast.emit('typing', {
            username: socket.username
        })
    })
    socket.on('stop typing', function(){
        socket.broadcast.emit('stop typing', {
            username: socket.username
        })
    })
    // disconnected user    
    socket.on('disconnect', function(){
        if(addedUser){
            --numUsers
            
            socket.broadcast.emit('user left',{
                username: socket.username,
                numUsers: numUsers
            })            
        }
        
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000')
})