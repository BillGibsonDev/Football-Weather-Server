import express from 'express';
import { WeatherModel } from "../models/Weather";
const router = express.Router();

const handleData = async () => {
  try {
    await fetch(`https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/2022/9?key=${process.env.NODE_ENV_SPORTS_KEY}`, {
      method: 'get'
    })
    .then((res) => res.json())
    .then((json) => {
      const data = json;
      for( let i = 0; i < data.length; i++){
        setTimeout(() => {
          handleWeather(data[i].StadiumDetails.GeoLat, data[i].StadiumDetails.GeoLong, data[i])
        }, 50000 * i)
      }
      return data;
    })
  } catch(err){
    console.log(err)
  }
}

const handleWeather = async (lat, lon, data) => {
  try {
    await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.NODE_ENV_WEATHER_KEY}&q=${lat},${lon}&days=10&aqi=no&alerts=yes`, {
      method: 'get'
    })
    .then((res) => res.json())
    .then((json) => {
      let day = json.forecast.forecastday.filter(weather => weather.date === data.DateTime.slice(0, 10))
      let hour = day[0].hour.filter(hour => hour.time.slice(11,13) === data.DateTime.slice(11,13))
      if(hour === undefined){
        console.log("hour undefined")
      } else if(data.Status === "Final"){
        console.log("game over")
      } else if(data.Status === "F/OT"){
        console.log("game over")
      } else {
        return hour
      }
    })
  } catch(err){
    console.log(err)
  }
}

export const getWeather = async (req, res) => { 
    try {
        const weather = await WeatherModel.find();
        res.status(200).json(weather);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createWeather = async (req, res) => {
    const { data } = req.body;
    const newWeather = new WeatherModel({ weather: data})
    try {
        await newWeather.save();
        res.status(201).json("Weather Created");
    } catch (error) {
        res.status(409).json({ message: error.message });
    }   
}

export const updateWeather = async (req, res) => {
    const { schduleId } = req.params;
    const { data } = req.body;
    await WeatherModel.find(
        { "_id": schduleId },
        { weather: data },
        { new: true }
    );
    res.json("Weather Updated");
}