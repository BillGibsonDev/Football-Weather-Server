import mongoose from 'mongoose';
import { GameModel } from '../models/Game.js';

export const getWeather = async (req, res) => { 
  try {
    const weather = await GameModel.find();
    res.status(200).json(weather);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const removeOlderGames = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const games = await GameModel.find({ 'GameData.Date': { $lt: today } });

    for (const game of games) {
      await game.remove();
      console.log(`${game.GameData.AwayTeam} vs ${game.GameData.HomeTeam} removed`);
    }

  } catch (error) {
    console.log(error);
  }
}

export const addWeatherData = async (data, dayWeather, hourlyWeather) => { 
  try {
    const game = await GameModel.findOne({ 'GameData.ScoreID': data.ScoreID });
    if(game){
      game.GameData = data;
      game.GameDayWeather = dayWeather;
      game.HourlyWeather = hourlyWeather;

      await game.save();
      console.log('Game Updated');
    } else {
      await GameModel.create({
        GameData: data,
        GameDayWeather: dayWeather,
        HourlyWeather: hourlyWeather
      })
      console.log('Game Created');
    }

    await removeOlderGames();

  } catch (error) {
    console.log(error);
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