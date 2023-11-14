import dotenv from "dotenv";
import axios from "axios";

// functions
import { handleWeather } from "./handleWeather.js";

dotenv.config();

let attempts = 5;

const statuses = ['InProgress', 'Final', 'F/OT', 'Postponed' ];

const handleTimeSort = (arr) => {
  arr.sort((a, b) => {
    let timeA = new Date(`${a.Date}`);
    let timeB = new Date(`${b.Date}`);
    return timeA - timeB;
  })
  const filteredGames = [];
  arr.forEach((game) => {
    if(!statuses.includes(game.Status)){
      filteredGames.push(game);
    }
  })
  return filteredGames;
}

// const gameDayCheck = (data) => {
//   const today = new Date();
//   const formattedToday = today.toDateString();
//   const filteredGames = [];

//   data.forEach((game) => {
//     const gameDate = new Date(game.DateTime);
//     const formattedGameDate = gameDate.toDateString();
//     if(formattedToday === formattedGameDate){
//       if(!statuses.includes(game.Status)){
//         filteredGames.push(game);
//       }
//     }
//   })
//   return filteredGames;
// }

export const handleGames = async () => {
  try {
    const response = await axios.get(`${process.env.NODE_ENV_SPORTS_API}`);
    const data = handleTimeSort(response.data);
    for (let i = 0; i < data.length; i++) {
      setTimeout(() => {
        handleWeather(data[i].StadiumDetails.GeoLat, data[i].StadiumDetails.GeoLong, data[i]);
      }, 1000 * 60 * .25 * i);
    }
  } catch (error) {
    if(attempts > 0){
      attempts--;
      setTimeout(() => {
        handleGames();
      }, 1000 * 60 * 5);
    } else {
      if(error.response.status){
        console.log(`Attempts Exceeded - Game API Error ${error.response.status}`);
      } else {
        console.log(`Attempts Exceeded - Game API Error ${error}`);
      }
    }
  }
};