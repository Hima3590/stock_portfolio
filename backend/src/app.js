import express from 'express';
import cors from 'cors';
import stockRoutes from './routes/stockRoutes.js';

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/stocks', stockRoutes);

export default app;
