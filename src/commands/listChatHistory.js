import chalk from 'chalk';
import { fetchChatHistory } from '../utils/api';

async function listChatHistory() {
    try {
        const chats = await fetchChatHistory();
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

export { listChatHistory };

