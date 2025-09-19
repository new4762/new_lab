const crypto = require('crypto');

class AuthData {
  constructor(data) {
    Object.assign(this, data);
  }

  async encrypt(key) {
    const jsonStr = JSON.stringify(this);
    const encoded = Buffer.from(jsonStr, 'utf-8');

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(encoded);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, encrypted, authTag]).toString('base64');
  }

  static async decrypt(encStr, key) {
    const encryptedBytes = Buffer.from(encStr, 'base64');
    const iv = encryptedBytes.slice(0, 12);
    const authTag = encryptedBytes.slice(-16);
    const data = encryptedBytes.slice(12, -16);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return new AuthData(JSON.parse(decrypted.toString('utf-8')));
  }
}

const key = Buffer.from('AES256Key-32Characters1234567890', 'utf-8');
const payload = `{
  "AuthCode": "2f8d7f222379c51888c9e568c66a3880",
  "ClientID": "123456789",
  "ClientSecret": "987654321",
  "CompletionURL": "http://www.example.com",
  "MobileNumber": "0899999999",
  "OTPRef": "ABCD",
  "PaymentRef": "123456"
}`;

// `{
//   "AuthCode": "2f8d7f222379c51888c9e568c66a3880",  // any number
//   "ClientID": "123456789", // any number
//   "ClientSecret": "987654321", // any number
//   "CompletionURL": "http://pay.lvh.me:3000/source_of_funds/truemoney/payments/{ref}/complete", // core complete endpoint with replaced {ref} with refernce 1 we saved from step 4
//   "MobileNumber": "0899999999", // any number
//   "OTPRef": "ABCD", // any string
//   "PaymentRef": "123456" // any number
// }`;


(async () => {
  const authData = new AuthData(JSON.parse(payload));

  console.log('Original Data:', authData);

  const encrypted = await authData.encrypt(key);
  console.log('Encrypted:', encrypted);

  const decrypted = await AuthData.decrypt(encrypted, key);
  console.log('Decrypted Data:', decrypted);
})();
