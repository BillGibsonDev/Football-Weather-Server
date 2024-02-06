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

export const removeOlderGames = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const games = await GameModel.find();
    for (const game of games) {
      const gameDate = new Date(game.GameData.Date);
      if(gameDate < today ){
        await game.remove();
        console.log(`Game Removed ${game.GameData.AwayTeam} vs ${game.GameData.HomeTeam}`);
      } 
    }
  } catch (error) {
    console.log(error);
  }
}

export const addWeatherData = async (data, dayWeather, hourlyWeather) => { 
  const update = new Date();
  try {
    const game = await GameModel.findOne({ 'GameData.ScoreID': data.ScoreID });
    
    const checkObject = (obj) => !obj || !Object.keys(obj).length;

    if (game) {
      game.Updated = update;
      game.GameData = data;

      if (!checkObject(dayWeather)) {
        game.GameDayWeather = dayWeather;
      }

      if (!checkObject(hourlyWeather)) {
        game.HourlyWeather = hourlyWeather;
      }

      await game.save();
      console.log(`Game Updated ${data.AwayTeam} vs ${data.HomeTeam}`);
    } else {
      await GameModel.create({
        Updated: update,
        GameData: data,
        GameDayWeather: checkObject(dayWeather) ? null : dayWeather,
        HourlyWeather: checkObject(hourlyWeather) ? null : hourlyWeather
      });
      console.log(`Game Created ${data.AwayTeam} vs ${data.HomeTeam}`);
    }

  } catch (error) {
    console.log(error);
  }
}