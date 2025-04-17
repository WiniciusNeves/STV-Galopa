import axios from 'axios';

import Config from 'react-native-config';

const API_BASE_URL = Config.BASE_URL;

if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in .env');
}

const apiRouter = axios.create({
    baseURL: API_BASE_URL
});

apiRouter.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default apiRouter;