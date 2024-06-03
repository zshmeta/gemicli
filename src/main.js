import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { listChats, setChat, initAI, genAi, createChat } from './commands/index';
import chalk from 'chalk';
import cfonts from 'cfonts';

const configPath = path.join(__dirname, './config/.env');
if (!fs.existsSync(configPath)) {
  console.log(chalk.red('Environment not set yet. Please run the --init command first.'));
  process.exit();
} 

async function gemicli() {
  const commands = {
    '--chat': async (args) => {
      try {
        await genAi(args.join(' '));
      } catch (error) {
        console.error(chalk.red(error.message));
      } finally {
        process.exit();
      }
    },
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
    '--set-model': (args) => {
      const config = JSON.parse(fs.readFileSync(configPath));
      config.model = args[0];
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(chalk.green(`Model set to: ${args[0]}`));
      process.exit();
    },
    '--set-key': (args) => {
      const config = JSON.parse(fs.readFileSync(configPath));
      config.apiKey = args[0];
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(chalk.green('API key set successfully'));
      process.exit();
    },
    '--ls-chat': async () => {
      await listChats();
      process.exit();
    },
    '--set-chat': async (args) => {
      const chatHistory = await setChat(args[0]);
      // Set global or module variable for chat history if necessary
      global.chatHistory = chatHistory;
      console.log(chalk.green(`Chat set to ID: ${args[0]}`));
      process.exit();
    },
    '--init': async () => {
      await initAI();
      process.exit();
    },
    '--new': async () => {
      const chatId = await createChat();
      global.chatHistory = [];
      console.log(chalk.green(`New chat created with ID: ${chatId}`));
      process.exit();
    }
  };

  const args = process.argv.slice(2);
  const command = args[0];

  if (args.length === 0 || command === '--help' || command === '-h') {
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
    console.log(chalk.cyanBright('--chat <message>                 Chat with the AI using the provided message.'));
    console.log(chalk.cyanBright('--image-embed <image_path>       Embed an image using the specified path.'));
    console.log(chalk.cyanBright('--set-model <model_name>         Set the AI model to use.'));
    console.log(chalk.cyanBright('--set-key <api_key>              Set the API key for authentication.'));
    console.log(chalk.cyanBright('--ls-chat                        List all chat sessions.'));
    console.log(chalk.cyanBright('--set-chat <chat_id>             Set the chat session to continue.'));
    console.log(chalk.cyanBright('--init                           Initialize the AI.'));
    console.log(chalk.cyanBright('--new                            Start a new chat session.'));
    process.exit();
  } else if (commands[command]) {
    await commands[command](args.slice(1));
  } else {
    await commands['--chat'](args);
  }
}

export { gemicli };
