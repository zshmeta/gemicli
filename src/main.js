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
      // Get the chat ID from the environment variables
      const chatId = process.env.CHATID;

      // If the chat ID is not set, print an error message and exit
      if (!chatId) {
        console.error(chalk.red('No chat ID set. Please use --set-chat <CHATID> or --new to start a new chat.'));
        process.exit();
      }

      // Get the prompt from the arguments
      const prompt = args.join(' ');

      // Save the chat message to the chat history
      await saveChat(chatId, 'user', prompt);

      // Generate the AI response
      await genAi(prompt);  // Process the prompt via AI

      process.exit();
    },

    // Command to embed an image using the path
    '--image-embed': async (args) => {
      // Create a spinner to indicate that the process is running
      const spinner = ora('Processing...').start();

      try {
        // Generate the AI response with the embedded image
        await genAiMulti(args[0], args.slice(1));

        // Update the spinner to indicate success
        spinner.succeed('Done');
      } catch (error) {
        // Update the spinner to indicate failure
        spinner.fail('Error');

        // Print the error message
        console.error(chalk.red(error.message));
      } finally {
        process.exit();
      }
    },

    // Command to set the AI model to use
    '--set-model': (args) => {
      // Read the configuration file
      const config = JSON.parse(fs.readFileSync(configPath));

      // Set the AI model in the configuration file
      config.model = args[0];

      // Write the updated configuration file
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      // Print a success message
      console.log(chalk.green(`Model set to: ${args[0]}`));

      process.exit();
    },

    // Command to set the API key for authentication
    '--set-key': (args) => {
      // Read the configuration file
      const config = JSON.parse(fs.readFileSync(configPath));

      // Set the API key in the configuration file
      config.apiKey = args[0];

      // Write the updated configuration file
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      // Print a success message
      console.log(chalk.green('API key set successfully'));

      process.exit();
    },

    // Command to initialize the AI
    '--init': async () => {
      // Initialize the AI
      await initAI();

      process.exit();
    },

    // Command to set the chat session to continue
    '--set-chat': async (args) => {
      // Get the chat ID from the arguments
      const chatId = parseInt(args[0], 10);

      // Check if the chat ID is valid
      if (isNaN(chatId)) {
        console.error(chalk.red('Invalid chat ID.'));
        process.exit();
      }

      // Get the chat history for the chat ID
      const chatHistory = setChat(chatId);

      // If the chat history is not found, print an error message and exit
      if (!chatHistory) {
        console.error(chalk.red('Chat ID does not exist.'));
        process.exit();
      }

      // Set the global chat history variable
      global.chatHistory = chatHistory;

      // Print a success message
      console.log(chalk.green(`Chat set to ID: ${chatId}`));

      process.exit();
    },

    // Command to start a new chat session
    '--new': async (args) => {
      // Get the prompt from the arguments
      const prompt = args.join(' ');

      // Create a new chat session
      const chatId = await createChat(prompt);

      // Print a success message
      console.log(chalk.green(`New chat created with ID: ${chatId}`));

      // If a prompt is provided, generate the AI response
      if (prompt) {
        await genAi(prompt);  // Process the initial message via AI
      }

      process.exit();
    },

    // Command to list all chat sessions
    '--ls-chat': async () => {
      // Get the list of chat sessions
      const chats = listChats();

      // Print the list of chat sessions
      console.log(chalk.cyan('Chat sessions:'));
      chats.forEach(chat => {
        console.log(chalk.yellow(`ID: ${chat.id}, Created At: ${chat.created_at}, Latest Message: ${chat.latest_message}`));
      });

      process.exit();
    }
  };

  // Get the arguments from the command line
  const args = process.argv.slice(2);

  // Get the command from the arguments
  const command = args[0];

  // If no command is provided, or the help command is provided, print the help message and exit
  if (args.length === 0 || command === '--help' || command === '-h') {
    // Print the Gemicli logo
    cfonts.say('Gemicli', {
      font: '3d',
      align: 'center',
      gradient: ['blue', 'green', 'magenta', 'yellow'],
      background: 'transparent',
      space: true,
      maxLength: '0',
      transitionGradient: true,
      env: 'node'
    });

    // Print the list of available commands
    console.log(chalk.cyanBright('--chat <message>                 Chat with the AI using the provided message.'));
    console.log(chalk.cyanBright('--image-embed <image_path>       Embed an image using the path.'));
       console.log(chalk.cyanBright('--set-model <model_name>         Set the AI model to use.'));
    console.log(chalk.cyanBright('--set-key <api_key>              Set the API key for authentication.'));
    console.log(chalk.cyanBright('--ls-chat                        List all chat sessions.'));
    console.log(chalk.cyanBright('--set-chat <chat_id>             Set the chat session to continue.'));
    console.log(chalk.cyanBright('--init                           Initialize the AI.'));
    console.log(chalk.cyanBright('--new                            Start a new chat session.'));

    process.exit();
  } else if (commands[command]) {
    // If the command is a valid command, execute it
    await commands[command](args.slice(1));
} else if (command.startsWith('--')) {
    // If the command starts with -- but is not recognized, print the help message
    console.log(chalk.red('Invalid command.'));
    console.log(chalk.cyanBright('Available commands:'));
    console.log(chalk.cyanBright('--chat <message>                 Chat with the AI using the provided message.'));
    console.log(chalk.cyanBright('--image-embed <image_path>       Embed an image using the path.'));
    console.log(chalk.cyanBright('--set-model <model_name>         Set the AI model to use.'));
    console.log(chalk.cyanBright('--set-key <api_key>              Set the API key for authentication.'));
    console.log(chalk.cyanBright('--ls-chat                        List all chat sessions.'));
    console.log(chalk.cyanBright('--set-chat <chat_id>             Set the chat session to continue.'));
    console.log(chalk.cyanBright('--init                           Initialize the AI.'));
    console.log(chalk.cyanBright('--new                            Start a new chat session.'));

    process.exit();
  } else {
    // If the command does not start with --, execute the default command (chat)
    await commands['--chat'](args);
  }

}

// Call the main function to start the application
export { gemicli }
// export default gemicli