require('dotenv').config();

module.exports = {
	apiKey: process.env.API_KEY,
	model: process.env.MODEL,
	systemPrompt: process.env.SYSTEM_PROMPT,
};
