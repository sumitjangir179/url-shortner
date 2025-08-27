import express from 'express';
import dotenv from 'dotenv';

dotenv.config('./.env');

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

import userRoutes from './routes/user.route.js';
app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

