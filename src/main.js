import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { listChatHistory, setChatHistory, initAI } from './commands/index';
// import configPath from './config/default.json';


const configPath = path.join(__dirname, 'config/default.json');

const program = new Command();

program
    .name(chalk.bold.blue('gemicli'))
    .description(chalk.cyan('CLI tool to interact with Gemini AI'))
    .version(chalk.green('1.0.0'))
    .showHelpAfterError();

program
    .command('--chat <message>')
    .description(chalk.yellow('Send a chat message to Gemini AI'))
    .action(async (message) => {
        const spinner = ora('Processing...').start();
        try {
            await chat(message);
            spinner.succeed('Done');
        } catch (error) {
            spinner.fail('Error');
            console.error(chalk.red(error.message));
        }
    });

program
    .command('--image-embed <imageUrl>')
    .description(chalk.yellow('Get image embedding from Gemini AI'))
    .alias('img')
    .alias('i')
    .action(async (imageUrl) => {
        const spinner = ora('Processing...').start();
        try {
            await imageEmbed(imageUrl);
            spinner.succeed('Done');
        } catch (error) {
            spinner.fail('Error');
            console.error(chalk.red(error.message));
        }
    });

program
    .command('--set-model <model>')
    .description(chalk.yellow('Set the model to be used'))
    .action((model) => {
        const config = JSON.parse(fs.readFileSync(configPath));
        config.model = model;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(chalk.green(`Model set to: ${model}`));
    });

program
    .command('--set-key <apiKey>')
    .description(chalk.yellow('Set the API key'))
    .action((apiKey) => {
        const config = JSON.parse(fs.readFileSync(configPath));
        config.apiKey = apiKey;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(chalk.green('API key set successfully'));
    });

program
    .command('--history-ls')
    .description(chalk.yellow('List the history of chat interactions'))
    .action(listChatHistory);

program
    .command('--history-set <id>')
    .description(chalk.yellow('Set a specific history item'))
    .action(setChatHistory);

program
    .command('--initAI')
    .description(chalk.yellow('Initialize the gemicli configuration'))
    .action(initAI);

program.on('--help', () => {
    
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}