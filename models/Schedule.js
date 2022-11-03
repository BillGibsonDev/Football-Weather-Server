import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
    schedule: Array,
})

export const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
