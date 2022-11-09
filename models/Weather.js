import mongoose from 'mongoose';

const WeatherSchema = new mongoose.Schema({
    Updated: String,
    Temp: Number,
    Wind: Number,
    Gusts: Number,
    Condition: String,
    Rain: Number, 
    Snow: Number,
    Alerts: String,
    Icon: String,
    Week: Number,
    ScoreID: Number
})

export const WeatherModel = mongoose.model("Weather", WeatherSchema);
