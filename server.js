const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 1337

const users = {}

app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
  console.log('a user connected')


  socket.on('new-user', username => {
    users[socket.id] = username
    socket.broadcast.emit('user-connected', username)
  })

  socket.on('send-message', (message) => {

    socket.broadcast.emit('send-message', {
      message: message,
      username: users[socket.id]
    })
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

http.listen(port, () => {
  console.log('listening on port ', port)
  console.log('listening on port: http://localhost:1337/')
})