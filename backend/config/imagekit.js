require('dotenv').config();
const ImageKit = require('@imagekit/nodejs');

const privateKey = process.env.IMAGE_KIT_PRIVATE_KEY || process.env.IMAGEKIT_PRIVATE_KEY;

let imagekitClient;

function getImageKitClient() {
  if (!privateKey) {
    throw new Error('ImageKit is not configured. Set IMAGE_KIT_PRIVATE_KEY or IMAGEKIT_PRIVATE_KEY in your backend .env file.');
  }

  if (!imagekitClient) {
    imagekitClient = new ImageKit({ privateKey });
  }

  return imagekitClient;
}

module.exports = {
  getImageKitClient,
};
