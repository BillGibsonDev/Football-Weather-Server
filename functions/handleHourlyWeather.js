import axios from 'axios';
import { generateUserAgent } from './generateUserAgent.js';

let attempts = 5;

export const handleHourlyWeather = async (forecastURL, data) => {
  try {
    const response = await axios.get(`${forecastURL}`, { headers: { 'User-Agent': generateUserAgent() }});
    const day = response.data.properties.periods.filter(weather => weather.startTime.slice(0, 10) === data.DateTime.slice(0, 10));
    
    const gameStartTimeUTC = new Date(data.DateTime).toISOString();
    const splitGameStartTime = gameStartTimeUTC.split('T')[1].split(':');
    const gameHourAndAbbreviation = `${splitGameStartTime[0]}, ${splitGameStartTime[2]}`;

    const timeIndex = day.findIndex(weather => {
      const weatherStartTimeUTC = new Date(weather.startTime).toISOString();
      const splitWeatherTime = weatherStartTimeUTC.split('T')[1].split(':');
      const weatherHourAndAbbreviation = `${splitWeatherTime[0]}, ${splitWeatherTime[2]}`;
      return weatherHourAndAbbreviation === gameHourAndAbbreviation;
    });

    let gameEndTime = timeIndex + 3;
    let hourlyWeather = day.slice(timeIndex, gameEndTime);

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