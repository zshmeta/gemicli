import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fetchModels } from '../utils/api';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function initAI() {
    try {
        console.log(chalk.blue('Initializing gemicli...'));
        
        const aiChoice = await askQuestion('Which AI to use? (default: gemini): ');
        const ai = aiChoice.trim() || 'gemini';
        
        if (ai !== 'gemini') {
            console.log(chalk.red('Currently, only Gemini AI is supported.'));
            process.exit(1);
        }

        const models = await fetchModels();
        console.log(chalk.blue('Available models:'));
        models.forEach((model, index) => {
            console.log(`${index + 1}. ${model}`);
        });

        const modelChoice = await askQuestion('Which model to use? (enter number): ');
        const model = models[parseInt(modelChoice, 10) - 1];
        if (!model) {
            console.log(chalk.red('Invalid model choice.'));
            process.exit(1);
        }

        const apiKey = await askQuestion('Enter your API key: ');

        const systemPrompt = await askQuestion('Enter a system prompt (default: "Hello, how can I assist you?"): ');
        const prompt = systemPrompt.trim() || 'Hello, how can I assist you?';

        const envContent = `API_KEY=${apiKey}\nMODEL=${model}\nSYSTEM_PROMPT="${prompt}"\n`;
        fs.writeFileSync(path.join(__dirname, '../../.env'), envContent);

        console.log(chalk.green('Initialization complete.'));
    } catch (error) {
        console.error(chalk.red('Initialization failed:', error.message));
    } finally {
        rl.close();
    }
}

export { initAI };