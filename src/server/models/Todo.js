import mongoose, { Schema } from 'mongoose';

const todo = mongoose.model('todo', new Schema({
    ref: Number,
    todo: String,
    isDone: Boolean
}));

export default todo;