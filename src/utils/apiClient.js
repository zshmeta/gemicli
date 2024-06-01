import axios from 'axios';
import config from './config';


const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Authorization': `Bearer ${config.apiKey}`,
    },
});

export default apiClient;

