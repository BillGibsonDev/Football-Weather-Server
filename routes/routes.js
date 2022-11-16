import express from 'express';
const router = express.Router();

// functions
import { getWeather } from '../controllers/GetGamesController.js';

//read
router.get('/games', getWeather);

export default router;