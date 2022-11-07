const CronJob = require('cron').CronJob;
const fs = require("fs");
require('dotenv').config()

import { GameModel } from '../models/Game';

// inital API call to get the game schedule
export const handleGames = async () => {
  try {
    await fetch(`https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/2022/9?key=${process.env.NODE_ENV_SPORTS_KEY}`, {
      method: 'get'
    })
      .then((res) => res.json())
      .then((json) => {
        const data = json;
        for (let i = 0; i < data.length; i++) {
          setTimeout(() => {
            handleWeather(data[i].StadiumDetails.GeoLat, data[i].StadiumDetails.GeoLong, data[i])
          }, 1000 * 60 * i / 3)
        }
      })
  } catch (err) {
    console.log(err)
  }
}

// calls the weather api with the sports data it recieves from handleGames
const handleWeather = async (lat, lon, data) => {
  try {
    await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.NODE_ENV_WEATHER_KEY}&q=${lat},${lon}&days=10&aqi=no&alerts=yes`, {
      method: 'get'
    })
      .then((res) => res.json())
      .then((json) => {
        let day = json.forecast.forecastday.filter(weather => weather.date === data.DateTime.slice(0, 10))
        let hour = day[0].hour.filter(hour => hour.time.slice(11, 13) === data.DateTime.slice(11, 13))
        if (hour === undefined) {
          handleLog(hour);
        } else if (data.Status === "InProgress") {
          handleLog(data.Status);
        } else if (data.Status === "Final") {
          handleLog(data.Status);
        } else if (data.Status === "F/OT") {
          handleLog(data.Status);
        } else {
          postData(data, hour);
        }
      })
  } catch (err) {
    console.log(err);
    handleLog(err);
  }
}

// takes in the sports data and weather data and creates the tweet
const postData = async (data, weather) => {
  const newGameModel = new GameModel({ 
    HomeTeam: data.HomeTeam,
    AwayTeam: data.AwayTeam,
    ScoreID: data.ScoreID,
    DateTime: data.DateTime,
    Channel: data.Channel, 
    StadiumLat: data.StadiumDetails.GeoLat,
    StadiumLon: data.StadiumDetails.GeoLong, 
    StadiumType: data.StadiumDetails.Type,
    StadiumName: data.StadiumDetails.Name,
    StadiumCity: data.StadiumDetails.City,
    StadiumCountry: data.StadiumDetails.Country,
    StadiumState: data.StadiumDetails.State,
    Status: data.Status,
    Week: data.Week,
    Weather: {
      Icon: weather.icon,
      Temp: weather.temp_f,
      Wind: weather.wind_mph,
      Gusts: weather.gust_mph,
      Condition: weather.text,
      Rain: weather.chance_of_rain, 
      Snow: weather.chance_of_snow,
    }
  })
  try {
    await newGameModel.save();
    let message = `\n data sent @ ${new Date}`;
    fs.appendFile("logs1.txt", message, function (err) {
      if (err) console.log(err);
      console.log(message);
    });
  } catch (err) {
    handleLog(err);
  }
}

// creates a log in the log file when the function is called
const handleLog = (log) => {
  let message = `\n ${log} @ ${new Date}`;
  fs.appendFile("logs1.txt", message, function (err) {
    if (err) console.log(err);
    console.log(`${err} @ ${message}`);
  });
}

// schedules the function to run @ 10am EST everyday
const job = new CronJob("0 10 * * *", () => {
  handleGames()
},
  null,
  true,
  'America/New_York'
);

job.start();