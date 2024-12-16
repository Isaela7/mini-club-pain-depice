import express from 'express';
import cors from 'cors';
import apiRoutes from './api/routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes API
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});