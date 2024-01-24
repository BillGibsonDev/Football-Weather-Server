import axios from 'axios';
import { generateUserAgent } from './generateUserAgent.js';

let attempts = 5;

export const handleHourlyWeather = async (forecastURL, data) => {
  try {
    const response = await axios.get(`${forecastURL}`, { headers: { 'User-Agent': generateUserAgent() }});
    const day = response.data.properties.periods.filter(weather => weather.startTime.slice(0, 10) === data.DateTime.slice(0, 10));

    const gameStartTimeEDT = new Date(data.DateTime);
    gameStartTimeEDT.setMinutes(0);
    const gameStartTime = gameStartTimeEDT.toLocaleString('en-US', { timeZone: 'America/New_York' });
    
    const timeIndex = day.findIndex(weather => {
      const weatherStartTimeEDT = new Date(weather.startTime);
      const weatherTime = weatherStartTimeEDT.toLocaleString('en-US', { timeZone: 'America/New_York' });
      return weatherTime === gameStartTime;
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