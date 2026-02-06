import Stock from '../models/Stock.js';
import axios from 'axios';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

/* ===============================
   CRUD
================================ */

export const createStock = async (req, res) => {
  try {
    const { symbol, quantity, buyPrice } = req.body;

    if (!symbol || !quantity || !buyPrice) {
      return res.status(400).json({ error: 'symbol, quantity, buyPrice are required' });
    }

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      quantity,
      buyPrice,
      user: req.userId
    });

    res.status(201).json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({ user: req.userId });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, buyPrice } = req.body;

    const stock = await Stock.findOneAndUpdate(
      { _id: id, user: req.userId },
      { quantity, buyPrice },
      { new: true }
    );

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;

    const stock = await Stock.findOneAndDelete({
      _id: id,
      user: req.userId
    });

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json({ message: 'Stock deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   Feature 8 – Search stocks
================================ */

export const searchStock = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query q is required' });

    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${q}&apikey=${API_KEY}`;
    const response = await axios.get(url);

    const results = (response.data.bestMatches || []).map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      region: match['4. region']
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search stocks' });
  }
};

/* ===============================
   Feature 9 – Live price (public)
================================ */

export const getLivePrice = async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    const quote = response.data['Global Quote'];

    if (!quote || !quote['05. price']) {
      return res.status(400).json({ error: 'Price unavailable' });
    }

    res.json({
      symbol,
      price: parseFloat(quote['05. price'])
    });
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch live price' });
  }
};

/* ===============================
   Feature 10 – Stock P/L
================================ */

export const getPortfolioStockInfo = async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await Stock.findOne({
      user: req.userId,
      symbol: symbol.toUpperCase()
    });

    if (!stock) {
      return res.status(404).json({ error: 'Stock not in portfolio' });
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    const currentPrice = parseFloat(response.data['Global Quote']['05. price']);

    const currentValue = currentPrice * stock.quantity;
    const investedValue = stock.buyPrice * stock.quantity;
    const profitLoss = currentValue - investedValue;
    const percentChange = (profitLoss / investedValue) * 100;

    res.json({
      symbol,
      currentPrice,
      buyPrice: stock.buyPrice,
      quantity: stock.quantity,
      profitLoss: profitLoss.toFixed(2),
      percentChange: percentChange.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch stock info' });
  }
};

/* ===============================
   🔥 Feature 11 – Portfolio Overview
================================ */

export const getPortfolioOverview = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('Fetching portfolio overview for user:', userId);

    const stocks = await Stock.find({ user: userId });
    console.log(`Found ${stocks.length} stocks`);

    let totalInvested = 0;
    let currentValue = 0;

    for (const stock of stocks) {
      const investedValue = stock.buyPrice * stock.quantity;
      const stockCurrentValue = (stock.currentPrice || stock.buyPrice) * stock.quantity;

      totalInvested += investedValue;
      currentValue += stockCurrentValue;

      console.log(`Stock ${stock.symbol}: Invested=${investedValue}, Current=${stockCurrentValue}`);
    }

    const profitLoss = currentValue - totalInvested;
    const profitLossPercent = totalInvested === 0 ? 0 : (profitLoss / totalInvested) * 100;

    const response = {
      totalInvested: Number(totalInvested.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      profitLoss: Number(profitLoss.toFixed(2)),
      profitLossPercent: Number(profitLossPercent.toFixed(2))
    };

    console.log('Portfolio overview:', response);
    res.json(response);
  } catch (err) {
    console.error('Error fetching portfolio overview:', err);
    res.status(500).json({ error: 'Unable to fetch portfolio overview' });
  }
};


/* ===============================
   Feature 12 – Stock Summary
================================ */

export const getStockSummary = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('Fetching stock summary for user:', userId);

    const stocks = await Stock.find({ user: userId });
    console.log(`Found ${stocks.length} stocks`);

    let totalQuantity = 0;
    let totalInvested = 0;

    for (const stock of stocks) {
      totalQuantity += stock.quantity;
      totalInvested += stock.buyPrice * stock.quantity;
    }

    const response = {
      totalStocks: stocks.length,
      totalQuantity,
      totalInvested: Number(totalInvested.toFixed(2))
    };

    console.log('Stock summary:', response);
    res.json(response);
  } catch (err) {
    console.error('Error fetching stock summary:', err);
    res.status(500).json({ error: 'Unable to fetch stock summary' });
  }
};

/* ===============================
   Feature 12 – Portfolio Breakdown (Chart Data)
================================ */

export const getPortfolioBreakdown = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('Fetching portfolio breakdown for user:', userId);

    const stocks = await Stock.find({ user: userId });
    console.log(`Found ${stocks.length} stocks`);

    const breakdown = stocks.map((stock) => {
      const investedValue = stock.buyPrice * stock.quantity;
      const currentValue = (stock.currentPrice || stock.buyPrice) * stock.quantity;

      return {
        symbol: stock.symbol,
        quantity: Number(stock.quantity),
        buyPrice: Number(stock.buyPrice),
        currentPrice: Number(stock.currentPrice || stock.buyPrice),
        investedValue: Number(investedValue.toFixed(2)),
        currentValue: Number(currentValue.toFixed(2)),
        profitLoss: Number((currentValue - investedValue).toFixed(2))
      };
    });

    console.log('Portfolio breakdown:', breakdown);
    res.json(breakdown);
  } catch (err) {
    console.error('Error fetching portfolio breakdown:', err);
    res.status(500).json({ error: 'Unable to fetch portfolio breakdown' });
  }
};
