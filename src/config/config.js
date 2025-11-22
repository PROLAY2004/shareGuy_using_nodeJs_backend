import dotenv from 'dotenv';

dotenv.config();

const configuration = {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  PORT: process.env.PORT,
  BOT_TOKEN: process.env.BOT_TOKEN,
  CHAT_ID: process.env.CHAT_ID,
};

export default configuration;
