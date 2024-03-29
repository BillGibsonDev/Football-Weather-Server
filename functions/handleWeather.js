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
    console.log(`Data Error - lat or lon not provided`);
    return;
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

      addWeatherData(data, forecasts.day, forecasts.hourly);
    }
  catch(error) {
    if(attempts > 0){
      attempts--;
      setTimeout(() => {
        handleWeather(lat, lon, data);
      }, 1000 * 20);
    } else {
     console.log(`Forecast Error ${error} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
    }
  }
};