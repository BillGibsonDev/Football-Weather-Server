import express from 'express';
const router = express.Router();

//import { handleGames } from '../controllers/GameController.js';
import { getWeather } from '../controllers/GetGamesController.js';

// // read
router.get('/games', getWeather);

// // update
// router.post(`/fetch`, job.start());

export default router;