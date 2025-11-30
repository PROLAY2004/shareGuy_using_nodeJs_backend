import dotenv from 'dotenv';

dotenv.config();

const configuration = {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  PORT: process.env.PORT,
  BOT_TOKEN: process.env.BOT_TOKEN,
  CHAT_ID: process.env.CHAT_ID,
  MONGO_URI: process.env.MONGO_URI,
  MAIL_SERVICE: process.env.MAIL_SERVICE,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
};

export default configuration;
