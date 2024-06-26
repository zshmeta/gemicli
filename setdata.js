import dotenv from 'dotenv';
import path from 'path';
// Load environment variables from .env file
dotenv.config({path: path.resolve(__dirname, '../data/.env')});

const CHATID = process.env.CHATID;

function setData(CHATID) {
	// returns the object corresponding to the chatid
	const data = fs.readFileSync(dataPath);
	const chats = JSON.parse(data);
	console.log(chats);

	const history = chats.find(history => history.CHATID === CHATID);
	return history;
}
