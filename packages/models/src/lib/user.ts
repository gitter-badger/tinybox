import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

export interface IUser extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  hashedPassword: string;
}

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => `u_${nanoid()}`,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model('User', userSchema);
