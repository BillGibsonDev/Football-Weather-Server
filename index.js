import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { CronJob } from 'cron';

// routes
import routes from './routes/routes.js';
import { handleGames } from './functions/main.js';
import { removeOlderGames } from './controllers/GamesController.js';

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

let week = 0;

const weeklyUpdate = new CronJob("0 2 * * 2", () => {
  week++;
  console.log('week updated');
},
  null,
  true,
  'America/New_York'
);

weeklyUpdate.start();

// const testJob = async () => {
//   try {
//     console.log('database job started');
//     const result = await handleGames(week);
//     console.log(result)
//   } catch(error){
//     console.log(error)
//   }
// }

// testJob()

const databaseJob = new CronJob("45 * * * *", async () => {
  console.log('database job started');
  try {
    const result = await handleGames(week);
    console.log(result)
  } catch(error){
    console.log(error)
  }
},
  null,
  true,
  'America/New_York'
);

databaseJob.start();

const cleanupJob = new CronJob("0 1 * * *", async () => {
  console.log('clean up job started');
    try {
    const result = await removeOlderGames(week);
    console.log(result)
  } catch(error){
    console.log(error)
  }
},
  null,
  true,
  'America/New_York'
);

cleanupJob.start();