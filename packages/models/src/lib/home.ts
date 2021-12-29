import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

export interface IHome extends mongoose.Document {
  _id: string;
  name: string;
  ownerId: string;
}

const homeSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => `h_${nanoid()}`,
  },
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
});

export const Home = mongoose.model('Home', homeSchema);
