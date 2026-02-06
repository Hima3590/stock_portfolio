import express from 'express';
import {
  createStock,
  getAllStocks,
  updateStock,
  deleteStock,
  searchStock,
  getLivePrice,
  getPortfolioStockInfo,
  getPortfolioOverview,
  getStockSummary,
  getPortfolioBreakdown
} from '../controllers/stockController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.get('/search', searchStock);
router.get('/price', getLivePrice);

// Protected
router.use(authMiddleware);

router.post('/', createStock);
router.get('/', getAllStocks);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);
router.get('/summary', getStockSummary);

router.get('/portfolio/overview', getPortfolioOverview);
router.get('/portfolio/breakdown', getPortfolioBreakdown);
router.get('/portfolio/:symbol', getPortfolioStockInfo);

export default router;
