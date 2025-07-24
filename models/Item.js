
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  price: Number,
  createdAt: { type: Date, default: Date.now, index: true }
});

export default mongoose.model('Item', itemSchema);
