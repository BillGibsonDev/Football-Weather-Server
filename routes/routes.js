import express from 'express';
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config();

import { handleGames } from '../controllers/GameController';

// // read
// router.get('/games');

// // update
router.post(`/update-games/${process.env.NODE_ENV_UPDATE_SECRET}`, handleGames());


export default router;