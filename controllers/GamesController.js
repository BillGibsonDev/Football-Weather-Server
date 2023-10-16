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

export const addWeatherData = async (data, dayWeather, hourlyWeather) => { 
  try {
    const game = await GameModel.findOne({ 'GameData.Gamekey': data.GameKey })
    if(game){
      game.GameData = data;
      game.GameDayWeather = dayWeather;
      game.HourlyWeather = hourlyWeather;

      await game.save();
      console.log('Game Updated')
    } else {
      await GameModel.create({
        GameData: data,
        GameDayWeather: dayWeather,
        HourlyWeather: hourlyWeather
      })

      console.log('Game Created')
    }

  } catch (error) {
    console.log(error)
  }
}

export const cleanupData = async () => { 
  try {
    const collection = mongoose.connection.collection('games')
    
    await collection.drop()

    console.log('collection cleaned')

  } catch (error) {
    console.log(error)
  }
}