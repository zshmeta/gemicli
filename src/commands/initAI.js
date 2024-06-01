#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import inquirer from 'inquirer';
import chalk from 'chalk';
import {fetchModels
} from '../utils/api';

// Create a readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const envPath = path.join(__dirname, '../../.env');

// Function to ask a question and return a promise
function askQuestion(query) {
	return new Promise(resolve => rl.question(query, resolve));
}

// Function to set the configs
async function initAI() {
	try {
		// Print a message to the console
		console.log(chalk.blue('Initializing gemicli configs...'));
		console.logs(chalk.blue('First, lets get yor api key'))
		// Ask the user for their API key
		const aiOptions = ['gemini'];
		const ai = inquirer.prompt([
			{
				type: 'list',
				name: 'ai',
				message: 'Which AI to use?',
				choices: aiOptions,
			},
		])

		const apiKey = inquirer.prompt([
			{
				type: 'input',
				name: 'apiKey',
				message: 'Enter your API key: ',
			},
		]);
		// use api key to fetch models
		const models = await fetchModels();
		// Ask the user which model to use
		const modelChoice = inquirer.prompt([
			{
				type: 'list',
				name: 'model',
				message: 'Which model to use?',
				choices: models,
			},
		]);

		const systemPrompt = inquirer.prompt([
			// set default is a general instruction to be helpfull and precise
			{
				type: 'input',
				name: 'systemPrompt',
				message: 'Enter your system prompt: ',
				default: 'You are a helpful assistant. and you will do your best to any querys with the appropriate format',
			},
		]);

		// Wait for all promises to resolve
		const answers = await Promise.all([ai, apiKey, modelChoice, systemPrompt]);

		// Write the configs to a JSON file
		const configs = {
			ai: answers[0].ai,
			apiKey: answers[1].apiKey,
			model: answers[2].model,
			systemPrompt: answers[3].systemPrompt,
		};
		fs.writeFileSync(envPath, JSON.stringify(configs));
		console.log(chalk.green('gemicli configs initialized successfully!'));

		} catch (error) {
		console.error(chalk.red('Error initializing gemicli configs:'), error);
	}
}



		



