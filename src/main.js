import { createChat, saveChat, setChat, listChats } from './commands/manageChat';
import { setData } from './utils/data';
import { genAi } from './commands/genAi';
import chalk from 'chalk';
import cfonts from 'cfonts'
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { genAiMulti } from './commands/genAiMulti';
import { initAI } from './commands/initAI';
// Path to the environment configuration file
const configPath = path.join(__dirname, './data/.env');
const dataPath = path.join(__dirname, './data/chats.json');



// Check if the environment configuration file exists
if (!fs.existsSync(configPath)) {
  // If the file does not exist, print an error message and exit
  console.log(chalk.red('Environment not set yet. Please run the --init command first.'));
  process.exit();
}

// Define the main function for the Gemicli application
async function gemicli() {
  



  // Define the available commands
  const commands = {
    // Command to chat with the AI using the provided message
    '--chat': async (args) => {
      const chatId = process.env.CHATID;
      if (!chatId) {

        process.exit();
      }
      const prompt = args.join(' ');
      await saveChat(chatId, 'user', prompt);
      await genAi(prompt);  // Process the prompt via AI
      process.exit();
    },

    // Command to embed an image using the path
    '--image-embed': async (args) => {
      const spinner = ora('Processing...').start();

      try {
        await genAiMulti(args[0], args.slice(1));
        spinner.succeed('Done');
      } catch (error) {
        spinner.fail('Error');
        console.error(chalk.red(error.message));
      } finally {
        process.exit();
      }
    },

    // Command to set the AI model to use
    '--set-model': (args) => {
      const config = JSON.parse(fs.readFileSync(configPath));
      config.model = args[0];
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(chalk.green(`Model set to: ${args[0]}`));

      process.exit();
    },

    // Command to set the API key for authentication
    '--set-key': (args) => {
      const config = JSON.parse(fs.readFileSync(configPath));
      config.apiKey = args[0];
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(chalk.green('API key set successfully'));
      process.exit();
    },

    // Create env snd set keys
    '--init': async () => {
      await initAI();

      process.exit();
    },

    // Command to set the chat session to continue
    '--set-chat': async (args) => {
      const chatId = parseInt(args[0], 10);
      if (isNaN(chatId)) {
        console.error(chalk.red('Invalid chat ID.'));
        process.exit();
      }
      const chatHistory = setChat(chatId);
      if (!chatHistory) {
        console.error(chalk.red('Chat ID does not exist.'));
        process.exit();
      }
      global.chatHistory = chatHistory;
      console.log(chalk.green(`Chat set to ID: ${chatId}`));
      process.exit();
    },

    // Command to start a new chat session
    '--new': async (args) => {
      const prompt = args.join(' ');
      const chatId = await createChat(prompt);
      console.log(chalk.green(`New chat created with ID: ${chatId}`));
      if (prompt) {
        await genAi(prompt);
      }

      process.exit();
    },



    // Command to list all chat sessions
    '--ls-chat': async () => {
      const truncate = (str, n) => {
        return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
      }
      const chats = listChats();
      console.log(chalk.cyan('Chat sessions:'));
      chats.forEach(chat => {
        console.log(chalk.cyan('________________________________________________________________________________'));
        console.log(chalk.yellow(`${chat.id}.`));
        console.log(chalk.yellow(`| user: ${truncate(chat.latest_user_message, 50)}`));
        console.log(chalk.yellow(`| model: ${truncate(chat.latest_model_message, 50)}`));
        console.log(chalk.cyan('--------------------------------------------------------------------------------'));
      });
      process.exit();
    }
  };

  const printHelp = () => {
        // Print the list of available commands
        console.log(chalk.cyanBright('--chat <message>                 Chat with the AI using the provided message.'));
        console.log(chalk.cyanBright('--image-embed <image_path>       Embed an image using the path.'));
        console.log(chalk.cyanBright('--set-model <model_name>         Set the AI model to use.'));
        console.log(chalk.cyanBright('--set-key <api_key>              Set the API key for authentication.'));
        console.log(chalk.cyanBright('--ls-chat                        List all chat sessions.'));
        console.log(chalk.cyanBright('--set-chat <chat_id>             Set the chat session to continue.'));
        console.log(chalk.cyanBright('--init                           Initialize the AI.'));
        console.log(chalk.cyanBright('--new                            Start a new chat session.'));
      };
      
  // Get the arguments from the command line
  const args = process.argv.slice(2);
  // Get the command from the arguments
  const command = args[0];
  // If no command is provided, or the help command is provided, print the help message and exit
  if (args.length === 0 || command === '--help' || command === '-h') {
    // Print the Gemicli logo
    cfonts.say('Gemicli', {
      font: 'console',
      align: 'center',
      gradient: ['blue', 'green', 'magenta', 'yellow'],
      background: 'transparent',
      space: true,
      maxLength: '0',
      transitionGradient: true,
      env: 'node'
    });
    printHelp();
    process.exit();
  } else if (commands[command]) {
    // If the command is a valid command, execute it
    await commands[command](args.slice(1));
} else if (command.startsWith('--')) {
    // If the command starts with -- but is not recognized, print the help message
    console.log(chalk.red('Invalid command.'));
    printHelp();
    process.exit();
  } else {
    await commands['--chat'](args);
  }

}

export { gemicli }