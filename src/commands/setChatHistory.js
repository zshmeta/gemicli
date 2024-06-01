import chalk from 'chalk';
import { fetchChatById } from '../utils/api';


async function setChatHistory(chatId) {
    try {
        const chat = await fetchChatById(chatId);
        console.log(chalk.green(`Selected chat with ID: ${chat.id}`));
        console.log(chalk.blue(`Chat content: ${chat.content}`));
        // Implement logic to set the chat as the current context if necessary
    } catch (error) {
        console.error(chalk.red('Error fetching chat:', error.message));
    }
}

export  { setChatHistory };