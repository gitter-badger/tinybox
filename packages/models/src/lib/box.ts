import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

export interface IBox extends mongoose.Document {
  _id: string;
  name: string;
  homeId: string;
  parentId?: string;
}

const boxSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => `b_${nanoid()}`,
  },
  name: {
    type: String,
    required: true,
  },
  homeId: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    required: false,
  },
});

export const Box = mongoose.model('Box', boxSchema);
