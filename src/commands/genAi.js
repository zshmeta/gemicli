import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import ora from 'ora';
import { embedChat } from './embedChat';
import { saveChat } from './manageChat';
import chalk from 'chalk';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../data/.env') });

const { API_KEY, model, SYSTEM_PROMPT } = process.env;

const genAI = new GoogleGenerativeAI(API_KEY);

async function genAi(prompt) {
  try {
    const genModel = genAI.getGenerativeModel({ model });

    const chat = genModel.startChat({
      history: global.chatHistory
    });

    const type = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const spinner = ora('Processing...').start();
    const result = await chat.sendMessage([prompt]);
    const response = await result.response;
    const text = await response.text();
    spinner.stop();

    global.chatHistory.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
    global.chatHistory.push({
      role: 'model',
      parts: [{ text }]
    });

    await saveChat(process.env.CHATID, 'user', prompt);
    await saveChat(process.env.CHATID, 'model', text);

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
