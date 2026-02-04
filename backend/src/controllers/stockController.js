import Stock from '../models/Stock.js';
import axios from 'axios';
import Portfolio from '../models/Portfolio.js';

const API_KEY=process.env.ALPHA_VANTAGE_API_KEY;

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

export const searchStock = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    // Example using Alpha Vantage SYMBOL_SEARCH endpoint
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;

    const response = await axios.get(url);
    const bestMatches = response.data.bestMatches || [];

    // Transform API response to something simple
    const results = bestMatches.map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      marketOpen: match['5. marketOpen'],
      marketClose: match['6. marketClose'],
      timezone: match['7. timezone'],
      currency: match['8. currency'],
      matchScore: match['9. matchScore']
    }));

    return res.status(200).json(results);

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Failed to search stocks' });
  }
};


// GET /api/stocks/price?symbol=AAPL

// Feature 9: Get live price (public)
export const getLivePrice = async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);
    const quote = response.data['Global Quote'];

    if (!quote || !quote['05. price']) {
      return res.status(400).json({ error: 'Failed to fetch live price' });
    }

    res.json({ symbol, price: parseFloat(quote['05. price']) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Unable to fetch stock price' });
  }
};

// Feature 10: Get live price + real portfolio profit/loss
export const getPortfolioStockInfo = async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const userId = req.userId; // comes from authMiddleware

    // Fetch user's portfolio entry
    const entry = await Stock.findOne({ user: userId, symbol });
    if (!entry) return res.status(404).json({ error: 'Stock not in your portfolio' });

    const { buyPrice, quantity } = entry;

    // Fetch live price
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);
    const quote = response.data['Global Quote'];

    if (!quote || !quote['05. price']) {
      return res.status(400).json({ error: 'Failed to fetch live price' });
    }

    const currentPrice = parseFloat(quote['05. price']);

    // Calculate profit/loss
    const profitLoss = (currentPrice - buyPrice) * quantity;
    const percentChange = ((currentPrice - buyPrice) / buyPrice) * 100;

    res.json({
      symbol,
      currentPrice,
      buyPrice,
      quantity,
      profitLoss: profitLoss.toFixed(2),
      percentChange: percentChange.toFixed(2)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Unable to fetch stock info' });
  }
};