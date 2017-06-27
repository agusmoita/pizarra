var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.use(express.static('public'))

io.on('connection', socket => {
	console.log('Alguien se conecto')
	socket.on('click', data => {
		socket.broadcast.emit('begin', data)
	})
	socket.on('drawing', data => {
		socket.broadcast.emit('move', data)
	})
})

server.listen(8080, () => console.log('Hola :)'))