import axios from 'axios';
import { generateUserAgent } from './generateUserAgent.js';

let attempts = 5;

function convertToEasternTime(date) {
  const utcDate = new Date(date);
  return utcDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
}

export const handleHourlyWeather = async (forecastURL, data) => {
  try {
    const response = await axios.get(forecastURL, { headers: { 'User-Agent': generateUserAgent() } });
    const day = response.data.properties.periods;

    const gameStartTime = new Date(data.DateTime);
    gameStartTime.setMinutes(0,0,0);
    const gameStartTimeUTC = gameStartTime.toISOString();

    const timeIndex = day.findIndex(weather => {
      const weatherStartTime = new Date(weather.startTime);
      weatherStartTime.setMinutes(0,0,0);
      return weatherStartTime.toISOString() === gameStartTimeUTC;
    });

    if (timeIndex === -1) {
      console.log(`Time index error: time index equals ${timeIndex}.`)
      return null;
    }

    const gameEndTimeIndex = Math.min(timeIndex + 8, day.length);
    const hourlyWeather = day.slice(timeIndex + 4, gameEndTimeIndex);

    if (hourlyWeather.length === 0) {
      console.log('No weather data available in the expected range');
      return null;
    }

    const hourlyWeatherET = hourlyWeather.map(weather => {
      const weatherStartTimeUTC = new Date(weather.startTime);
      const weatherStartTimeET = convertToEasternTime(weatherStartTimeUTC);
      return { ...weather, startTimeET: weatherStartTimeET };
    });

    return hourlyWeatherET;
  }
  catch(error) {
    if(attempts > 0){
      attempts--;
      setTimeout(() => {  
        handleHourlyWeather(forecastURL, data);
      }, 1000 * 20);
    } else {
      console.log(`Attempts Exceeded - ${error} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
      return null;
    }
  }
}