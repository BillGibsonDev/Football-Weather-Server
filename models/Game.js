import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    GameData: {},
    GameDayWeather: {},
    HourlyWeather: {}
})

export const GameModel = mongoose.model("Games", GameSchema);
