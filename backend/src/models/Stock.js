import mongoose from 'mongoose';
const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true },
  quantity: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },

  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{ timestamps: true}
);

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
