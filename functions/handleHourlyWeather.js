import axios from 'axios';
import { generateUserAgent } from './generateUserAgent.js';

let attempts = 5;

export const handleHourlyWeather = async (forecastURL, data) => {
  try {
    const response = await axios.get(`${forecastURL}`, { headers: { 'User-Agent': generateUserAgent() }});
    const day = response.data.properties.periods;

    const gameStartTime = new Date(data.DateTime);
    gameStartTime.setMinutes(0);
    const gameStartTimeUTC = gameStartTime.toLocaleString('en-US', { timeZone: 'UTC' });

    const timeIndex = day.findIndex(weather => {
      const weatherStartTime = new Date(weather.startTime);
      const weatherStartTimeUTC = weatherStartTime.toLocaleString('en-US', { timeZone: 'UTC' });
      if(weatherStartTimeUTC === gameStartTimeUTC){
        console.log(weatherStartTimeUTC)
        console.log(gameStartTimeUTC)
      }
      return weatherStartTimeUTC === gameStartTimeUTC;
    });

    let gameEndTime = timeIndex + 9;
    let hourlyWeather = day.slice(timeIndex + 6, gameEndTime);

    return hourlyWeather;
  }
  catch(error) {
    if(attempts > 0){
        attempts--;
        setTimeout(() => {  
          handleHourlyWeather(forecastURL, data);
        }, 1000 * 20);
    } else {
      console.log(`Attempts Exceeded - Hourly Error ${error} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
      return undefined;
    }
  }
}