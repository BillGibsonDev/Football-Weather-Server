import mongoose from 'mongoose';

const WeatherSchema = new mongoose.Schema({
    Temp: String,
    Wind: String,
    Gusts: String,
    Condition: String,
    Rain: Number, 
    Snow: Number,
    Alerts: String,
    Icon: String,
})

const GameSchema = new mongoose.Schema({
    HomeTeam: String,
    AwayTeam: String,
    ScoreID: String,
    DateTime: String,
    Channel: String, 
    StadiumLat: String,
    StadiumLon: String, 
    StadiumType: String,
    StadiumName: String,
    StadiumCity: String,
    StadiumCountry: String,
    StadiumState: String,
    Status: String,
    Week: Number,
    Weather: [{ type: WeatherSchema, ref: 'Weather'}]
})

export const GameModel = mongoose.model("Game", GameSchema);
