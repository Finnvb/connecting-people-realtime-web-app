const express = require('express')
const {
  use
} = require('express/lib/application')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 1338
let count = 0

const users = {}

app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
  console.log(`a user connected`)

  count++
  console.log(count)


  socket.on('new-user', username => {
    users[socket.id] = username
    socket.broadcast.emit('user-connected', username)
    io.emit('usercount', count)
    io.emit('new-user-icon', username[0], username)
    io.emit('update-user-icons', users)
  })


  socket.on('disconnect', () => {
    console.log('user disconnected')
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
    count--
    io.emit('usercount', count)
    io.emit('update-user-icons', users)
  })


  socket.on("send-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      username: users[socket.id],
    });
  });
})

http.listen(port, () => {
  console.log('listening on port ', port)
  console.log('listening on port: http://localhost:1338/')
})