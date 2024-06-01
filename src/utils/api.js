import apiClient from './apiClient';

async function fetchModels() {
    try {
        const response = await apiClient.get('/v1/models');
        return response.data.models;
    } catch (error) {
        throw new Error('Failed to fetch models');
    }
}

async function fetchChatHistory() {
    try {
        const response = await apiClient.get('/chats');
        return response.data.chats;
    } catch (error) {
        throw new Error('Failed to fetch chat history');
    }
}

async function fetchChatById(chatId) {
    try {
        const response = await apiClient.get(`/chats/${chatId}`);
        return response.data.chat;
    } catch (error) {
        throw new Error('Failed to fetch chat');
    }
}

export {
    fetchModels,
    fetchChatHistory,
    fetchChatById,
    apiClient
};
