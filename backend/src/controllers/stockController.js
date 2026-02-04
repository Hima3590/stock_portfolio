import Stock from '../models/Stock.js';

export const createStock = async (req, res) => {
  try {
    const { symbol, quantity, buyPrice } = req.body;
    const stock = await Stock.create({
      symbol,
      quantity,
      buyPrice,
      user:req.userId
    });
    return res.status(201).json(stock);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({user:req.userId});
    return res.status(200).json(stocks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, buyPrice } = req.body;
    
    const stock = await Stock.findByIdAndUpdate(
      {_id:id,user:req.userId},
      { quantity, buyPrice },
      { new: true }
    );
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    return res.status(200).json(stock);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findByIdAndDelete({
      _id:id,
      user:req.userId
    });
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    return res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPortfolioSummary = async (req, res) => {
  try {
    const stocks = await Stock.find({user:req.userId});

    let totalInvested = 0;
    let totalQuantity = 0;

    for (let stock of stocks) {
      totalInvested += stock.quantity * stock.buyPrice;
      totalQuantity += stock.quantity;
    }

    return res.status(200).json({
      totalStocks: stocks.length,
      totalQuantity,
      totalInvested
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

