import axios from 'axios';
import { handleErrorLog } from './handleLog.js';
import { generateUserAgent } from './generateUserAgent.js';

let attempts = 20;

export const handleHourlyWeather = async (forecastURL, data) => {
  try {
    const response = await axios.get(`${forecastURL}`, { headers: { 'User-Agent': generateUserAgent() }});
    const day = response.data.properties.periods.filter(weather => weather.startTime.slice(0, 10) === data.DateTime.slice(0, 10));
    
    const gameStartTimeEDT = new Date(data.DateTime).toLocaleString('en-US', { timeZone: 'America/New_York' });
    const gameStartTime = gameStartTimeEDT; 
    const splitGameStartTime = gameStartTime.split(' ');
    const gameHourAndAbbreviation = splitGameStartTime[1].split(':');

    const timeIndex = day.findIndex(weather => {
      const weatherStartTimeEDT = new Date(weather.startTime).toLocaleString('en-US', { timeZone: 'America/New_York' });
      const weatherTime = weatherStartTimeEDT; 
      const splitWeatherTime = weatherTime.split(' ');
      const weatherHourAndAbbreviation = splitWeatherTime[1].split(':');
      
      return `${weatherHourAndAbbreviation[0]}, ${splitWeatherTime[2]}` === `${gameHourAndAbbreviation[0]}, ${splitGameStartTime[2]}`;
    });
    let gameEndTime = timeIndex + 3;
    let hourlyWeather = day.slice(timeIndex, gameEndTime);

    return hourlyWeather;
  }
  catch(error) {
    console.log(error);
    if(attempts > 0){
        attempts--;
        setTimeout(() => {  
          handleHourlyWeather(forecastURL, data);
        }, 1000 * 60);
    } else {
      handleErrorLog(`Attempts Exceeded - Hourly Error ${error} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
      return undefined;
    }
  }
}