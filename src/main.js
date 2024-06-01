import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { listChatHistory, setChatHistory, initAI } from './commands/index';
import { NewStyle } from 'blipgloss';
import chalk from 'chalk';  // Ensure chalk is imported

const configPath = path.join(__dirname, 'config/default.json');

async function gemicli() {
  // Styles
  const titleStyle = NewStyle()
    .Bold(true)
    .Foreground({
      Light: { TrueColor: '#FF0000', ANSI256: '160', ANSI: '9' },
      Dark: { TrueColor: '#00FF00', ANSI256: '40', ANSI: '10' }
    })
    .Background({
      Light: { TrueColor: '#0000FF', ANSI256: '27', ANSI: '12' },
      Dark: { TrueColor: '#FF00FF', ANSI256: '13', ANSI: '13' }
    })
    .Padding(2)
    .Align('center')
    .Width(50);

  const cmdStyle = NewStyle()
    .Bold(true)
    .Foreground('cyan')
    .Padding(2)
    .Align('center')
    .Width(50);

  const describeStyle = NewStyle()
    .Bold(true)
    .Foreground('cyan')
    .Background({
      Light: { TrueColor: '#0000FF', ANSI256: '27', ANSI: '12' },
      Dark: { TrueColor: '#FF00FF', ANSI256: '13', ANSI: '13' }
    })
    .Padding(2)
    .Align('center')
    .Width(50);

  const commands = {
    '--chat': async (args) => {
      const spinner = ora('Processing...').start();
      try {
        await chat(args[0]);
        spinner.succeed('Done');
      } catch (error) {
        spinner.fail('Error');
        console.error(chalk.red(error.message));
      } finally {
        process.exit();
      }
    },
    '--image-embed': async (args) => {
      const spinner = ora('Processing...').start();
      try {
        await imageEmbed(args[0]);
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
    '--history-ls': () => {
      listChatHistory();
      process.exit();
    },
    '--history-set': (args) => {
      setChatHistory(args[0]);
      process.exit();
    },
    '--init': () => {
      initAI();
      process.exit();
    }
  };

  const args = process.argv.slice(2);
  const command = args[0];

  if (args.length === 0 || command === '--help' || command === '-h') {
    // Display help menu
    const title = titleStyle.Render('gemicli');
    console.log(title);
    console.log(cmdStyle.Render('--chat <message>'), describeStyle.Render('Chat with the AI using the provided message.'));
    console.log(cmdStyle.Render('--image-embed <image_path>'), describeStyle.Render('Embed an image using the specified path.'));
    console.log(cmdStyle.Render('--set-model <model_name>'), describeStyle.Render('Set the AI model to use.'));
    console.log(cmdStyle.Render('--set-key <api_key>'), describeStyle.Render('Set the API key for authentication.'));
    console.log(cmdStyle.Render('--history-ls'), describeStyle.Render('List the chat history.'));
    console.log(cmdStyle.Render('--history-set <history>'), describeStyle.Render('Set the chat history.'));
    console.log(cmdStyle.Render('--init'), describeStyle.Render('Initialize the AI.'));
    process.exit();
  } else if (commands[command]) {
    commands[command](args.slice(1));
  } else {
    console.log(chalk.red(`Unknown command: ${command}`));
    process.exit(1);
  }
}

export default gemicli;
