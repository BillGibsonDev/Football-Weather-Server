import mongoose from 'mongoose';
import { GameModel } from '../models/Game.js';

// inital call to get the game data
export const getWeather = async (req, res) => { 
  try {
    const weather = await GameModel.find();
    res.status(200).json(weather);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
