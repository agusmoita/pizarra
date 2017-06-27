'use strict'

class Pencil {

	constructor (pizarra) {
		this.started = false
		this.color = '#000'
		this.pizarra = pizarra
		this.pizarra.strokeStyle = this.color
	}

	changeColor () {
		this.color = this.color == '#000' ? '#f00' : '#000'
		this.pizarra.strokeStyle = this.color
	}

	mousedown (ev) {
		this.begin(ev.layerX, ev.layerY)
		this.started = true
		socket.emit('click', {
			x: ev.layerX, 
			y: ev.layerY
		})
	}

	mousemove (ev) {
		if (this.started) {
			this.move(ev.layerX, ev.layerY)
			socket.emit('drawing', {
				x: ev.layerX, 
				y: ev.layerY,
				color: this.color
			})
		}
	}

	mouseup (ev) {
		if (this.started) {
			this.mousemove(ev)
			this.started = false
		}
	}

	moveMsg (data) {
		this.pizarra.strokeStyle = data.color
		this.move(data.x, data.y)
		this.pizarra.strokeStyle = this.color
	}

	begin (x, y) {
		this.pizarra.beginPath()
		this.pizarra.moveTo(x, y)
	}

	move (x, y) {
		this.pizarra.lineTo(x, y)
		this.pizarra.stroke()
	}
}

const socket = io.connect('http://localhost:8080', {'forceNew': true})

const canvas = document.getElementById("pizarra")
const pizarra = canvas.getContext("2d")
const btn = document.getElementById('boton')
init()

function init () {
	const pencil = new Pencil(pizarra)

	canvas.addEventListener('mousedown', ev_handler, false)
	canvas.addEventListener('mousemove', ev_handler, false)
	canvas.addEventListener('mouseup',	 ev_handler, false)
	btn.addEventListener('click', ev_change, false)

	socket.on('begin', io_begin)
	socket.on('move', io_move)

	function ev_handler (ev) {
		pencil[ev.type](ev)
	}
	function ev_change (ev) {
		pencil.changeColor()
	}
	function io_begin (data) {
		pencil.begin(data.x, data.y)
	}
	function io_move (data) {
		pencil.moveMsg(data)
	}
}