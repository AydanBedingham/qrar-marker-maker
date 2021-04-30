import { enc } from 'crypto-js';

const DEFAULT_JWT_HEADER = {
    "alg": "HS256",
    "typ": "JWT"
  };

const removeIllegalCharacters = (input) => {
    return input.replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
}
  
const base64Obj = (input) => {
    const inputWords = enc.Utf8.parse(JSON.stringify(input));
    const base64 = enc.Base64.stringify(inputWords);
    return removeIllegalCharacters(base64);
}

export const generateUnsignedJwtToken = (payload, header = DEFAULT_JWT_HEADER) => {
    return base64Obj(header) + "." + base64Obj(payload);
}