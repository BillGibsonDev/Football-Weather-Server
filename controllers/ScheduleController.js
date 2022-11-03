import express from 'express';
import { ScheduleModel } from "../models/Schedule";
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

export const getSchedule = async (req, res) => { 
    try {
        const schedule = await ScheduleModel.find();
        res.status(200).json(schedule);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createSchedule = async (req, res) => {
    const { data } = req.body;
    const newSchedule = new ScheduleModel({ schedule: data})
    try {
        await newSchedule.save();
        res.status(201).json("Schedule Created");
    } catch (error) {
        res.status(409).json({ message: error.message });
    }   
}

export const updateSchedule = async (req, res) => {
    const { schduleId } = req.params;
    const { data } = req.body;
    await ScheduleModel.find(
        { "_id": schduleId },
        { schedule: data },
        { new: true }
    );
    res.json("Schedule Updated");
}
