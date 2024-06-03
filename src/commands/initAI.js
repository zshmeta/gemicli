#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { fetchModels } from '../utils/api'; // Ensure this is correctly implemented and imported

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../data/.env');
// if file exists move it to .env.bak

// Function to write a key-value pair to the .env file
function writeEnv(key, value) {
    const envContent = `${key}=${value}\n`;
    fs.appendFileSync(envPath, envContent, { flag: 'a' });
}

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function initAI() {

    if (fs.existsSync(envPath)) {
        // ask wether to move the file 
        const configSave = await askQuestion('Config file already exists. Do you want to move it to .env.bak? (y/n): ');
        if (configSave.toLowerCase() !== 'y') {
            console.log('Exiting...');
            process.exit(0);
        }
        fs.renameSync(envPath, `${envPath}.bak`);

    }
    
    try {
        console.log(chalk.blue('Initializing gemicli configs...'));

        // Ask the user for their AI choice
        const aiChoices = ['gemini'];
        const geminiModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro-vision'];

        console.log('Which AI to use?');
        aiChoices.forEach((choice, index) => console.log(`${index + 1}. ${choice}`));
        const aiChoiceIndex = await askQuestion('Enter number of your choice: ');
        const ai = aiChoices[parseInt(aiChoiceIndex) - 1];
        if (!ai) {
            console.error(chalk.red('Invalid choice'));
            process.exit(1);
        }
        writeEnv('AI', ai);

        // Ask the user for their API key
        const apiKey = await askQuestion('Enter your API key: ');
        writeEnv('GOOGLE_API_KEY', apiKey);

        // Ask the user which model to use
        console.log('Which model to use?');
        geminiModels.forEach((choice, index) => console.log(`${index + 1}. ${choice}`));
        const modelChoiceIndex = await askQuestion('Enter number of your choice: ');
        const model = geminiModels[parseInt(modelChoiceIndex) - 1];
        if (!model) {
            console.error(chalk.red('Invalid choice'));
            process.exit(1);
        }

        writeEnv('MODEL', model);

        // Ask for the system prompt
        const systemPrompt = await askQuestion('Enter your system prompt (default: "You are a helpful assistant. You will do your best to answer any queries with the appropriate format."): ') || 'You are a helpful assistant. You will do your best to answer any queries with the appropriate format.';
        writeEnv('SYSTEM_PROMPT', `"${systemPrompt}"`);

        console.log(chalk.green('gemicli configs initialized successfully!'));
    } catch (error) {
        console.error(chalk.red('Error initializing gemicli configs:'), error);
    } finally {
        rl.close();
    }
}

export { initAI }
