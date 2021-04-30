import axios from 'axios';

export default class ShortUrlGenerator {

    constructor(shortenerScriptUrl) {
        this.shortenerScriptUrl = shortenerScriptUrl;
    }

    shortenUrl = async (url) => {
        const response = await axios.get(this.shortenerScriptUrl, {
            params: {
                url: url
            }
        });
        return response.data.shortUrl;
    }
}