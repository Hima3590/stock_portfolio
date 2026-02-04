import express from 'express';
import { createStock, getAllStocks, updateStock, deleteStock, getPortfolioSummary } from '../controllers/stockController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/', createStock);
router.get('/', getAllStocks);
router.get('/summary', getPortfolioSummary);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);

export default router;
