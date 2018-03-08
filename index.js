import express from 'express';
import Mongoclient from 'mongodb';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import config from './config';

let app = express();
let _client = '';

const url = 'mongodb://localhost:27017';
const dbName = 'TEST';

//Connect to Database
let connection = () => {
	let app = express();
	return Mongoclient.connect(url, (err, client) => {
		if (err) console.log('Erro! ', err);
		else {
			console.log("Connected successfully to server");
			_client = client;
		}
	});
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.use(function (req, res, next) {
	res.header(`Access-Control-Allow-Origin`, `*`);
	res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
	res.header(`Access-Control-Allow-Headers`, `Content-Type`);
	next();
});

connection(); // ON APPEL LA FONCTION SANS QUOI ÇA MARCHE PAAAAAAAAAAAAAAAAAAAAAAAAS !!!!

app.get('/', (req, res) => {
	res.status(200).send("It's working");
});

app.post('/signup', (req, res) => {
	// console.log(_client);
	// console.log(JSON.stringify(req.body));
	// console.log("HELLO WORLD");
	let body = req.body;
	if (body.username && body.password) {
		let db = _client.db(dbName);
		db.collection('users').find({
			username: body.username
		}).toArray(function (err, docs) {
			if (docs.length > 0) {
				res.status(404).send({
					message: 'This username already exist'
				});
			} else {
				// let db = _client.db(dbName);
				let dbCol = db.collection('users');
				// const payload = { ////////////////
					// username: body.username, ////////////////
					// password: body.password, ////////////////
				// }; ////////////////
				let user = {
					username: body.username,
					password: body.password,
					message: body.message,
					// token: jwt.sign(payload, app.get('superSecret'), {}), ////////////////
				};

				dbCol.insertOne(user, function (err, result) {
					if (err) {
						res.status(404).send(err);
					} else {
						res.status(200).send('user created');
					}
				});
			}
		});
	} else {
		res.status(412).send({
			message: 'You should provide an username AND a password'
		});
	}
});

app.set('superSecret', config.secret);

app.post('/login', function (req, res) {
	let body = req.body;
	if (body.username && body.password) {
		let db = _client.db(dbName);
		db.collection('users').find({
			username: body.username
		}).toArray(function (err, docs) {
			if (docs.length > 0) {
				let doc = docs[0];
				if (doc.password == body.password) {
					const payload = {
						username: body.username,
						password: body.password,
					};
					let token = jwt.sign(payload, app.get('superSecret'), {});
					res.status(200).json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				} else res.status(412).send({
					message: 'Wrong password'
				});
			} else res.status(404).send({
				message: 'This username does not exist'
			});
		});
	} else res.status(412).send({
		message: 'You should provide an username AND a password'
	});
});

app.post('/token', (req, res) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		console.log(token);
		jwt.verify(token, app.get('superSecret'), function (err, decode) {
			if (err) {
				return res.json({
					success: false,
					message: 'Invalid token '
				});
			} else {
				req.decode = decode;
				console.log(req.decode);
				res.status(200).send('Welcome Captain Youz');
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

// USER_LIST VERSION GET :
app.get('/users_list', (req, res) => {
	let token = req.headers.token;
	if (token) {
		// console.log(token);
		jwt.verify(token, app.get('superSecret'), function (err, decode) {
			if (err) {
				return res.json({
					success: false,
					message: 'Invalid token '
				});
			} else {
				req.decode = decode;
				// console.log(req.decode);
				let db = _client.db(dbName);
				db.collection("users").find({}).toArray((err, users) => {
					if (err) throw err;
					res.status(200).json({
						message: 'List of users :',
						users: users
					});
				});
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

// MESSAGES VERSION GET :
app.get('/messages', (req, res) => {
	let token = req.headers.token;
	if (token) {
		// console.log(token);
		jwt.verify(token, app.get('superSecret'), function (err, decode) {
			if (err) {
				return res.json({
					success: false,
					message: 'Invalid token '
				});
			} else {
				let toki = req.decode = decode;
				console.log(req.decode);
				console.log('toki = ', toki);
				toki = decode.username;
				console.log('toki = ', toki);
				let db = _client.db(dbName);
				db.collection("users").find({username : toki}).toArray((err, messages) => {
					if (err) throw err;
					res.status(200).json({
						message: 'List of messages :',
						messages: messages
					});
				});
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

app.listen(3333, function () {
	console.log('Listening on port 3333');
});