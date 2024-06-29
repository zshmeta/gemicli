import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import spinnit from 'spinnit';
import { embedChat } from './embedChat.js';
import { saveChat } from './manageChat.js';
import chalk from 'chalk';
import { readData, setData } from '../utils/data.js';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../data/.env') });



const { API_KEY, model, CHATID } = process.env;
const genAI = new GoogleGenerativeAI(API_KEY);

async function genAi(prompt) {
  try {

    await saveChat(process.env.CHATID, 'user', prompt);
    // console.log(prompt);
    // console.log(CHATID)
    // const history = setData(CHATID)
    // console.log(history);

    //const embedHistory = await embedChat(history);

    const genModel = genAI.getGenerativeModel({ model });
    const equationSpinner = spinnit({ spinner: 'equation', speed: 200 });
    equationSpinner.start();

    // Embed and save the user's prompt
    const chat = genModel.startChat({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });


    // Generate response from AI
    const result = await chat.sendMessage([prompt]);
    const response = await result.response;
    const text = await response.text();

    // save the AI's response
    await saveChat(process.env.CHATID, 'model', text);

    equationSpinner.stop();

    const stream = async (text) => {
      for (const chunk of text) {
        process.stdout.write(chalk.green(chunk));
        await new Promise(resolve => setTimeout(resolve, 13));
      }
      process.stdout.write('\n');
    };
    
    console.log("");
    console.log(chalk.cyan.bold('Gemini '));
    console.log(chalk.yellow.bold("================================================================================"));
    await stream(text);
    console.log(chalk.yellow.bold("================================================================================"));

    equationSpinner.stop(true);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

export { genAi };
