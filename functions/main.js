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

// saving for future use??
// const checkForCurrentGames = (data) => {
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

const apiURL = `${process.env.NODE_ENV_SPORTS_API}`;
const apiKey = `${process.env.NODE_ENV_SPORTS_KEY_1}`;

export const handleGames = async (week) => {
  try {
    const response = await axios.get(`${apiURL}${week}?key=${apiKey}`);
    const games = handleTimeSort(response.data);
    const promises = games.map((game, i ) => {
      return new Promise(resolve => {
        setTimeout( async () => {
          const result = await handleWeather(game.StadiumDetails.GeoLat, game.StadiumDetails.GeoLong, game);
          resolve();
        }, 1000 * 60 * .25 * i);
      })
    })
    
    await Promise.all(promises)

    return 'database job complete';
  } catch (error) {
    if(attempts > 0){
      attempts--;
      setTimeout(() => {
        handleGames(week);
      }, 1000 * 60 * 5);
    } else {
      if(error.response.status){
        return `Attempts Exceeded - Game API Error ${error.response.status}`;
      } else {
        return `Attempts Exceeded - Game API Error ${error}`;
      }
    }
  }
};