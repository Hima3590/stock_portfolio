import express from 'express';
import { createStock, getAllStocks, updateStock, deleteStock, getPortfolioSummary } from '../controllers/stockController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { searchStock } from '../controllers/stockController.js';
import { getLivePrice } from '../controllers/stockController.js';
import {getPortfolioStockInfo} from '../controllers/stockController.js';


const router = express.Router();

// Public endpoint (no auth required)
router.get('/price', getLivePrice);

// Protected endpoints (auth required)
router.use(authMiddleware);
router.get('/search', searchStock);
router.get('/portfolio/:symbol', getPortfolioStockInfo);
router.post('/', createStock);
router.get('/', getAllStocks);
router.get('/summary', getPortfolioSummary);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);

export default router;
