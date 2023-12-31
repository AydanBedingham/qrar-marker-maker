const fetch = require('node-fetch');

const tinyUrl = async (url) => {
    try{
        const tinyUrl = 'https://tinyurl.com/api-create.php?' + new URLSearchParams({
            url: url
        })
        
        const response = await fetch(tinyUrl);
        return response.text();
        
    } catch(error) {
        throw "Failed to generate shortened Url: " + error
    }
}

exports.handler = async (event) => {

    try {
        const url = event.queryStringParameters.url;

        if (url === undefined){
            throw "No url query string parameter!";
        }
        
        const shortUrl = await tinyUrl(url);

        const payload = {
            shortUrl : shortUrl
        }

        return {
            statusCode: 200,
            body: JSON.stringify(payload)
        };

    } catch (error){
        const errorCode = error.code || 500;
        const errorStr = error.message || error;
    
        return {
            statusCode: errorCode,
            body: JSON.stringify({
                error : errorStr
            })
        };
    }
};
