// functions
import { handleErrorLog, handleTweetLog } from './handleLog.js';
import { rwClient } from './twitterClient.js';

// team data
import { TeamNames } from '../TeamNames.js';

const handleHourlyFormat = (hourly) => {
  let string = '';
  if(!hourly){ return string };
  hourly.forEach((hour, index) => {
    const weatherStartTimeEDT = new Date(hour.startTime).toLocaleString('en-US', { timeZone: 'America/New_York' });
    const weatherTime = weatherStartTimeEDT; 
    const splitWeatherTime = weatherTime.split(' ');
    const weatherHourAndAbbreviation = splitWeatherTime[1].split(':');
    let time =  `\n<-- ${weatherHourAndAbbreviation[0]}:${weatherHourAndAbbreviation[1]} ${splitWeatherTime[2]} -->`;
    if(index === 0){
      time = `<-- ${weatherHourAndAbbreviation[0]}:${weatherHourAndAbbreviation[1]} ${splitWeatherTime[2]} -->`;
    }
    string += `
${time}
${hour.temperature} F
${hour.windSpeed} ${hour.windDirection}
${hour.shortForecast}`;
  });
  return `\n\n** Hourly Forecast in EST **${string}`;
};

const handleTimeString = (date) => {
  let time;
  const dataHour = Number(date.slice(11, 13));

  if (dataHour >= 12) {
    if (dataHour === 12) {
      time = `12:${date.slice(14, 16)} pm EST`;
    } else {
      time = `${dataHour - 12}:${date.slice(14, 16)} pm EST`;
    }
  } else {
    time = `${dataHour}:${date.slice(14, 16)} am EST`;
  }
  return time;
}

const handleChannel = (channel) => {
  if(!channel){
    return 'TBA';
  } else {
    return channel;
  }
}

const handleStadiumType = (stadium) => {
  if (stadium.Type === 'RetractableDome') {
    return 'Retractable Dome';
  } else {
    return stadium.Type;
  }
}

const handleDayString = (day) => {
  const weekday = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date(day);
  const dayName = weekday[d.getDay()];

  return dayName;
}

export const tweet = async (data, gameDayWeather, hourlyWeather) => {
  if(!gameDayWeather){
    handleErrorLog(`No forecast available yet ${data.AwayTeam} at ${data.HomeTeam}`);
    return;
  }

  // handles team name for hashtags
  const awayTeam = TeamNames.find(team => team.id === data.AwayTeam);
  const homeTeam = TeamNames.find(team => team.id === data.HomeTeam);

  // const day = handleDayString(data.Day);
  const hourly = handleHourlyFormat(hourlyWeather);
  const stadiumType = handleStadiumType(data.StadiumDetails);
  const channel = handleChannel(data.Channel);
  const time = handleTimeString(data.DateTime);

  const tweetText = `#${awayTeam.name} @ #${homeTeam.name} - ${time} on ${channel}
  
${data.StadiumDetails.Name} - ${data.StadiumDetails.City}, ${data.StadiumDetails.State}
Type: ${stadiumType}
Surface: ${data.StadiumDetails.PlayingSurface}

** Game Day Forecast ** 
${gameDayWeather.detailedForecast}${hourly}`;
  try {
    // await rwClient.v2.tweet(tweetText);
    handleTweetLog(data, tweetText);
  } catch (error) {
    handleErrorLog(error);
  }
}