import mongoose from 'mongoose';
import { GameModel } from '../models/Game.js';

// inital call to get the game data
export const getGames = async (req, res) => { 
  try {
    const games = await GameModel.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
