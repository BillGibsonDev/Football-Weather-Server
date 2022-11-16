import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    Updated: String,
    Week: Number,
    ScoreID: Number,
    HomeTeam: String,
    AwayTeam: String,
    Channel: String,
    DateTime: String,
    Status: String,
    Weather: {
        Temp: Number,
        Wind: Number,
        Gusts: Number,
        Condition: String,
        Rain: Number, 
        Snow: Number,
        Icon: String,
    },
    Stadium: {
        GeoLat: Number,
        GeoLong: Number,
        City: String,
        Name: String,
        State: String,
        Country: String,
        Type: String,
        Surface: String,
    }
})

export const GameModel = mongoose.model("Game", GameSchema);
