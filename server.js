const dotenv = require('dotenv');
const isDev = process.env.NODE_ENV !== 'production';
dotenv.config();

const next = require('next');
const routes = require('./routes');

const app = next({ dev: isDev });
const handler = routes.getRequestHandler(app);
const bodyParser = require('body-parser');
const axios = require('axios');
const compression = require('compression');

const mongoose = require('mongoose');

let urlMongo = '';

if (process.env.DB_USER) {
	urlMongo = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-qtgza.mongodb.net/?authSource=admin&w=1`;
} else {
	f;
	urlMongo = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-qtgza.mongodb.net/`;
}

mongoose.connect(urlMongo, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

class Telegram {
	sendTelegramMessage(message) {
		const botId = process.env.TELEGRAM_BOTID;
		const chatId = process.env.TELEGRAM_CHATID;

		if (!botId || !chatId) {
			return;
		}

		const telegramMsg = encodeURIComponent(message);

		const url = `https://api.telegram.org/${botId}/sendMessage?chat_id=${chatId}&text=${telegramMsg}`;
		axios.get(url);
	}
}

const telegram = new Telegram();

const QuestionsController = require('./server/controllers/QuestionsController');
const QuestionInstance = new QuestionsController(telegram);

const express = require('express');

process.on('uncaughtException', function(err) {
	console.log(err);
});

app.prepare()
	.then(() => {
		const server = express();

		server.use(compression());

		server.use(bodyParser.urlencoded({ extended: false }));
		server.use(bodyParser.json());

		server.post('/api/send_question', QuestionInstance.sendQuestion);
		server.post('/api/send_answer', QuestionInstance.sendAnswer);
		server.get('/api/questions', QuestionInstance.getQuestions);

		server.use(handler);

		server.listen(process.env.PORT || 3000, function() {
			console.log('Server is running on port 3000');
		});

		console.log(`Server started on port 3000 | Url: localhost:3000`);
	})
	.catch(() => {
		console.log('err');
	});
