const crypto = require('crypto');

// ALGORITHM: AES-256-CBC is a robust symmetric encryption algorithm.
// We use it to ensure that environment variables are stored securely efficiently.
const ALGORITHM = 'aes-256-cbc';

// CONFIGURATION:
// ENCRYPTION_KEY: Must be 256 bits (32 bytes).
// In production, this should come strictly from a secure environment variable.
// We allow a random fallback for development convenience, but this means data cannot be decrypted
// if the server restarts (since the key changes).
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') 
  : crypto.randomBytes(32); 

// IV_LENGTH: Initialization Vector length for AES is always 16 bytes.
// We generate a unique IV for every encryption operation to prevent pattern analysis.
const IV_LENGTH = 16;

/**
 * Encrypts a plain text string using AES-256-CBC.
 * @param {string} text - The raw environment content to encrypt.
 * @returns {string} - The encrypted string in format "IV:EncryptedData" (hex encoded).
 */
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // Return IV + Encrypted data separated by ':' so we can extract the IV during decryption
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypts a string that was encrypted by the `encrypt` function.
 * @param {string} text - The "IV:EncryptedData" string.
 * @returns {string} - The original plain text.
 */
function decrypt(text) {
  const textParts = text.split(':');
  // Extract IV (first part)
  const iv = Buffer.from(textParts.shift(), 'hex');
  // Extract Encrypted Text (joined remaining parts)
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
