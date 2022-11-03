import mongoose from 'mongoose';

const WeatherSchema = new mongoose.Schema({
    weather: Array,
})

export const WeatherModel = mongoose.model("Weather", WeatherSchema);
