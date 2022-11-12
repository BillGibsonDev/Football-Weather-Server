import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';

// functions
import { handleGames } from './controllers/FetchGamesController.js';

import routes from './routes/routes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

mongoose.connect(   
  process.env.NODE_ENV_MONGO_KEY, {
    useNewUrlParser: true,
  }
);

// calls the handleGame function every 30minutes
const job = cron.schedule("30 */1 * * *", () => {
  handleGames();
  console.log('job started')
},
  null,
  true,
  'America/New_York'
);

app.use('/', routes);

app.listen(port, host, () => {
  console.log(`Server active on ${port}`);
  job.start();
}); 
