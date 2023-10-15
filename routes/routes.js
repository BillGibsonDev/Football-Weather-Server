import express from 'express';
const router = express.Router();

// functions
import { getWeather } from '../controllers/GamesController.js';

//read
router.get('/games', getWeather);

export default router;