import axios from 'axios';

export const shortenUrl = async (url) => {
    const response = await axios.get(process.env.REACT_APP_SHORTEN_URL_SCRIPT_URI, {
        params: {
        url: url
        }
    });

    return response.data.shortUrl;
}