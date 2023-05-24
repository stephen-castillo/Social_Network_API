const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    thoughts: [thoughtSchema],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const User = model('User', userSchema);

module.exports = User;