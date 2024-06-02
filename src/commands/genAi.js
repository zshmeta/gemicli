import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import ora from 'ora';
import { embedChat } from './embedChat';
import { saveChat, setChat, createChat } from './manageChat';

import chalk from 'chalk';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

const { API_KEY, model, SYSTEM_PROMPT } = process.env;

const genAI = new GoogleGenerativeAI(API_KEY);

async function genAi(prompt) {
  try {
    const genModel = genAI.getGenerativeModel({ model });

    const chat = genModel.startChat({
      history: chatHistory
    });

    const type =(ms) =>{
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    const spinner = ora('Processing...').start();
    const result = await chat.sendMessage([prompt]);
    const response = await result.response;
    const text = await response.text();
    spinner.stop();

    chatHistory.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
    chatHistory.push({
      role: 'model',
      parts: [{ text }]
    });

    const userEmbeddings = await embedChat(prompt);
    const modelEmbeddings = await embedChat(text);

    const stream = async (text) => {
      for (const chunk of text) {
        process.stdout.write(chalk.green(chunk));
        await type(13);
      }
      process.stdout.write('\n');
    };
    
    console.log("");
    console.log("");
    console.log(chalk.cyan.bold('Gemini '))
    console.log(chalk.yellow.bold("================================================================================"))
    console.log("")
    await stream(text);
    console.log("")
    console.log(chalk.yellow.bold("================================================================================"))
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export { genAi };
