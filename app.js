'use strict'

const express = require('express')
const bodyParser  = require('body-parser')
const request = require('request')
const natasha_token = 'EAAD2KxZC6BLIBAEC34jCQKS92mE0Ya8mwZBAY3jpcAJyCkhfrmncKofsDFpUGeBfIsPMVfXWZCSVLZBdmMdeo7f4gq2syBKghgrmLZAQ3SIAhxSA7OKZCxgwtTxqYkjeZACDahy8th021SCOyuLl8OCNnh1cPdTgC6j7ivegeOW1QZDZD';

const app = express()

app.set('port', 5000)

/*Asi nuestro servidor entendera que usaremos una api*/
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send('Hola mundo!')
})


/*Esta pieza  nos permite recibir mensajes, entender que recibimos desde msn
y poder separarlo para saber que tipo de mensaje envio, y saber que responder*/
app.post('/webhook', (req, res) => {

	/*extraemos el objeto que nos envia msn en un array*/
	const webhook_event = req.body.entry[0];

	/*verificar s hay un mensaje*/
	if (webhook_event.messaging) {
		/*iteramos sobre ellos*/
		webhook_event.messaging.forEach(message => {
			console.log(message)
		})
	}
	/*notificamos a FB que recibimos el mensaje*/
	res.sendStatus(200)
})


/*este webhook verifica  un token*/
app.get('/webhook', (req, res) => {
	
	/*Si el token que le lelga es el mismo que el 	que guardamos*/
	if(req.query['hub.verify_token'] === 'natasha_token') {
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