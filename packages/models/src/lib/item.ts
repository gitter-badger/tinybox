import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

export interface IItem extends mongoose.Document {
  _id: string;
  name: string;
  quantity: number;
  homeId: string;
  boxId: string;
}

const itemSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => `i_${nanoid()}`,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  homeId: {
    type: String,
    required: true,
  },
  boxId: {
    type: String,
    required: true,
  },
});

export const Item = mongoose.model('Item', itemSchema);
