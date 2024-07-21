import axios from "axios";

// functions
import { handleHourlyWeather } from "./handleHourlyWeather.js";
import { generateUserAgent } from "./generateUserAgent.js";

let attempts = 5;

export const handleForecastData = async ( forecast, hourly, data ) => {
  if(!forecast || !hourly ) {
    return `No hourly forecast available ${data.AwayTeam} at ${data.HomeTeam}`;
  }
  try {
    const dayForecast = await axios.get(forecast, { headers: { "User-Agent": generateUserAgent() }});
    const hourlyForecast = await handleHourlyWeather(hourly, data);

    const day = dayForecast.data.properties.periods.filter((weather) => weather.startTime.slice(0, 10) === data.DateTime.slice(0, 10));

    let forecastObj = {};
    if (data.DateTime.slice(11, 13) < 17) {
      // if the game is during the day before 5pm aka 17:00, uses the day forecast
      forecastObj = {
        day: day[0],
        hourly: hourlyForecast
      }
      return forecastObj;
    } else if (day.length < 2){
      // if the bot runs at a later time, it will only return the night forecast
      forecastObj = {
        day: day[0],
        hourly: hourlyForecast
      }
      return forecastObj;
    } else {
      // if the game is at night, it will be the 2nd forecast
      forecastObj = {
        day: day[1],
        hourly: hourlyForecast
      }
      return forecastObj;
    }
  }
  catch(error){
    if(attempts > 0){
      attempts--;
      setTimeout(() => {
        handleForecastData(forecast, hourly, data);
      }, 1000 * 60);
    } else {
      return `Hourly Forecast Error ${error} on game ${data.AwayTeam} vs ${data.HomeTeam}`;
    }
  }
}