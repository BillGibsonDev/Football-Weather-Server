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
    const gameStartTimeUTC = gameStartTime.toISOString();

    const timeIndex = day.findIndex(weather => {
      const weatherStartTime = new Date(weather.startTime);
      return weatherStartTime.toISOString() === gameStartTimeUTC;
    });

    if (timeIndex === -1) {
      return null;
    }

    const gameEndTimeIndex = timeIndex + 7;
    const hourlyWeather = day.slice(timeIndex + 4, gameEndTimeIndex);

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