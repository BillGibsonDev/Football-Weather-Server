import mongoose from 'mongoose';
import { WeatherModel } from '../models/Weather.js';

// inital call to get the game data
export const getWeather = async (req, res) => { 
  try {
    const weather = await WeatherModel.find();
    res.status(200).json(weather);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
