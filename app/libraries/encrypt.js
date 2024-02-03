// AUTHOR: Atiq
var crypto = require('crypto');

const algorithm = 'aes256';
const inputEncoding = 'utf8';
const outputEncoding = 'hex';
const ivlength = 16  // AES blocksize
let iv = crypto.randomBytes(ivlength); // initialize vector

const key = process.env.OTP_SECRET_KEY; // key must be 32 bytes for aes256

exports.encrypt = (text) => {
    console.log('Ciphering "%s"', text);

    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var ciphered = cipher.update(text, inputEncoding, outputEncoding);
    ciphered += cipher.final(outputEncoding);
    //var ciphertext = iv.toString(outputEncoding) + ':' + ciphered

    console.log('ciphered text: ' + ciphered);
    return ciphered;
};

exports.decrypt = (text) => {
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var deciphered = decipher.update(text, outputEncoding, inputEncoding);
    deciphered += decipher.final(inputEncoding);

    console.log('deciphered text: '+deciphered);
    return deciphered;
};