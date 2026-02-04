import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stockSymbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  buyPrice: { type: Number, required: true }, // per share
}, { timestamps: true });

export default mongoose.model('Portfolio', portfolioSchema);
