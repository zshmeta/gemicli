import chalk from 'chalk';
import { fetchChat } from '../utils/api';

async function setChat(chatId) {
	// Implement logic to fetch the chat from the API
	
	try {
		const chat = await fetchChat(chatId);
		console.log(chalk.green(`Selected chat with ID: ${chat.id}`));
		console.log(chalk.blue(`Chat content: ${chat.content}`));
		// Implement logic to set the chat as the current context if necessary
	} catch (error) {
		console.error(chalk.red('Error fetching chat:', error.message));
	}
}

export {setChat};
