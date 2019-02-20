'use strict'

const express = require('express')
const bodyParser  = require('body-parser')
const request = require('request')

const app = express()

app.set('port', 5000)

/*Asi nuestro servidor entendera que usaremos una api*/
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send('Hola mundo!')
})

/*este webhook verifica  un token*/
app.get('/webhook', (req, res) => {
	
	/*Si el token que le lelga es el mismo que el 	que guardamos*/
	if(req,query['hub.verify_token'] === 'natasha_token') {
		/*Conexion establecida*/
		res.send(req.query['hub.challenge']);
	
	} else {
		res.send('bot pizza no tiene permisos')
	}
})

app.listen(app.get('port'), err => {
	if (err) {
		console.log('Hubo un eror').proccess.exit(1)
	} else {
		console.log(`Servidor funciona en el puerto ${app.get('port')}`)
	}
})