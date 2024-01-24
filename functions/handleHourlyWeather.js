import axios from 'axios';
import { generateUserAgent } from './generateUserAgent.js';

let attempts = 5;

export const handleHourlyWeather = async (forecastURL, data) => {
  try {
    const response = await axios.get(`${forecastURL}`, { headers: { 'User-Agent': generateUserAgent() }});
    const day = response.data.properties.periods;

    const gameStartTime = new Date(data.DateTime);
    gameStartTime.setMinutes(0);
    
    const timeIndex = day.findIndex(weather => {
      const weatherStartTime = new Date(weather.startTime);
      if(weatherStartTime.toUTCString() === gameStartTime.toUTCString()){
        console.log(weatherStartTime.toLocaleString('en-US', { timeZone: 'America/New_York' }))
        console.log(gameStartTime.toLocaleString('en-US', { timeZone: 'America/New_York' }))
      }
      return weatherStartTime.toUTCString() === gameStartTime.toUTCString();
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