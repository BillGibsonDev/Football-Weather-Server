import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// functions
import { handleForecastData } from "./handleForecastData.js";
import { generateUserAgent } from "./generateUserAgent.js";
import { addWeatherData } from "../controllers/GamesController.js";

let attempts = 5;

export const handleWeather = async (lat, lon, data) => {
  if(!lat || !lon ){
    return `Data Error - lat or lon not provided`;
  }
  try {
    const response = await axios.get(`${process.env.NODE_ENV_WEATHER_API}/${lat},${lon}`, {
      headers: {
        "User-Agent": generateUserAgent(),
      }
    })
      const hourlyForecastURL = await response.data.properties.forecastHourly;
      const dailyForecastURL = await response.data.properties.forecast;
      const forecasts = await handleForecastData(dailyForecastURL, hourlyForecastURL, data);

      const result = await addWeatherData(data, forecasts.day, forecasts.hourly);
      return result;
  } catch(error) {
    if(attempts > 0){
      attempts--;
      setTimeout(() => {
        handleWeather(lat, lon, data);
      }, 1000 * 20);
    } else {
      return `Forecast Error ${error} on game ${data.AwayTeam} vs ${data.HomeTeam}`;
    }
  }
};