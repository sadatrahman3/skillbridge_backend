import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db';
import app from './app';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SkillBridge server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
