import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { CronJob } from 'cron';

// routes
import routes from './routes/routes.js';
import { handleGames } from './functions/main.js';
import { cleanupData } from './controllers/GamesController.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5001;

mongoose.connect(process.env.NODE_ENV_MONGO_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use('/', routes);

app.listen(port, host, () => {
  console.log(`Server active on ${port}`);
}); 

const databaseJob = new CronJob("55 * * * 3-1", () => {
  handleGames();
  console.log('database job started');
},
  null,
  true,
  'America/New_York'
);

databaseJob.start();

const cleanupJob = new CronJob("0 5 * * 2", () => {
  cleanupData();
  console.log('clean up started');
},
  null,
  true,
  'America/New_York'
);

cleanupJob.start();