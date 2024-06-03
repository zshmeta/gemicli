import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Load API key from environment file
const envPath = path.join(__dirname, '../data/.env');
if (fs.existsSync(envPath)) {
	const envContent = fs.readFileSync(envPath);
	const envVars = envContent.toString().split('\n');
	envVars.forEach(varLine => {
		const [key, value] = varLine.split('=');
		process.env[key] = value;
	});
}

const apiClient = axios.create({
	baseURL: 'https://generativelanguage.googleapis.com/v1beta',
	headers: {
		'Authorization': `Bearer ${process.env.API_KEY}`,
	},
});

async function fetchModels() {
	try {
		const response = await apiClient.get('/models');
		return response.data.models.map(model => model.name);
	} catch (error) {
		console.error('Error fetching models:', error);
		throw error;
	}
}

async function fetchChats() {
	try {
		const response = await apiClient.get('/chats');
		return response.data.chats;
	} catch (error) {
		console.error('Error fetching previous chats:', error);
		throw error;
	}
}

export { fetchModels, fetchChats }