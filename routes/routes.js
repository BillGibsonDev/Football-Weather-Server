import express from 'express';
const router = express.Router();

//import { handleGames } from '../controllers/GameController.js';
import { getGames } from '../controllers/GetGamesController.js';

// // read
router.get('/games', getGames);

// // update
// router.post(`/fetch`, job.start());

export default router;