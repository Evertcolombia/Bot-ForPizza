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
		webhook_event.messaging.forEach(event => {
			handleMessage(event)
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

/*Esta funcion nos permite leer, el mensaje, extraer la informacion
y saber que vamos a responder, en si manejar mensajes*/
function handleMessage(event) {
	/*Obtenemos el que envia, y el texto*/
	const senderId = event.sender.id;
	const messageText = event.message.text;

	/*Creamos un objeto donde guardaremos la informacion
	que acabamos de obtener */

	const messageData  = {
		/*Quien recibe el mensaje, de momento el mismo que 
		lo envio*/
		recipient: {
			id: senderId
	},
		message: {
			text: messageText
		}
	}
	/*Llamamos a la funcion quele envia la informacion
	al bot, pasandole este mensaje*/
	callSendApi(messageData)

	/*Esta funcion la llamaremos en el webhook que recibe el mensaje
	en donde lo recibe*/ 
}

/*Funcion que le envia los mensajes al bot, la informacion*/
function callSendApi (response) {

	/*Usamos request para enviar la informacion a nuestro bot*/
	request({

		/*un atributo url y le pasamos la api a la cual nos vamos
		a conectar*/
		'url': 'https://graph.facebook.com/me/messages/',
		/*le enviamos el token necesario para saber que esta app, esta conectada
		esto en una propiedad qs que es un objeto que recibe un 'access_token con nuestro 
		token'*/
		'qs': {
			'access_token': natasha_token
		},
		/*Metodo por el que enviamos a informacion, en un atributo method*/
		'method': 'POST',
		/*un atributo 'json', pasandole el response osea el mensaje qe trae la 
		funcion, asi le indicamos que manejaremos la respuesta por json*/
		'json': response
	
	},
	/*declaramos una funcion anonima que nos permita saber si se envio el mensaje
	o hubo un error*/
	function (err) {
		err ? console.log('Ha ocurrido un error al enviar el mensaje') : console.log('Mensaje enviado')
	}
	) 
}


app.listen(app.get('port'), err => {
	if (err) {
		console.log('Hubo un eror').proccess.exit(1)
	} else {
		console.log(`Servidor funciona en el puerto ${app.get('port')}`)
	}
})