import chalk from 'chalk';
import { fetchChat } from '../utils/api';

async function listChat() {
	try {
		const chats = await fetchChat();
		if (chats.length === 0) {
			console.log(chalk.yellow('No chat history found.'));
			return;
		}
		chats.forEach((chat, index) => {
			console.log(`${index + 1}. ${chat.id} - ${chat.summary}`);
		});
	} catch (error) {
		console.error(chalk.red('Error fetching chat history:', error.message));
	}
}

export {listChat};
