import fs from 'fs';

const handleDates = () => {
  let date = new Date();
  let dateString = date.toDateString();
  let removedSpaces = dateString.replace(/ /g, "");
  let removedYear = removedSpaces.replace(/2023/, "");

  return removedYear;
}

export const handleErrorLog = (log) => {
  let message = `\n${log} @ ${new Date}\n`;
  fs.appendFile(`./tweet-logs/Errors-${handleDates()}-logs.txt`, message, function (err) {
    if (err) console.log(err);
  });
}

export const handleTweetLog = (data, log) => {
  const statuses = ['InProgress', 'Final', 'F/OT', 'Postponed' ];
  let message;

  let gameDate = data.DateTime;
  let slicedGameDate = gameDate.slice(0,13);

  if(statuses.includes(data.Status)){
    message = `\n${data.Status} - ${data.AwayTeam} vs ${data.HomeTeam} @ ${new Date()}\n`;
  } else {
    message = `\n${log}\n`;
  }
  fs.appendFile(`./tweet-logs/${slicedGameDate}-logs.txt`, message, function (err) {
    if (err) console.log(err);
  });
}