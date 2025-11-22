import dotenv from 'dotenv';

dotenv.config();

const configuration = {
<<<<<<< HEAD
  PORT: process.env.PORT,
=======
  FRONTEND_URL: process.env.FRONTEND_URL,
  PORT: process.env.PORT,
  BOT_TOKEN: process.env.BOT_TOKEN,
  CHAT_ID: process.env.CHAT_ID,
>>>>>>> cbf5620abea96e32390490ea76f6908129c1cc72
};

export default configuration;
