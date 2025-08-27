import express from 'express';

const app = express();

// application-level middleware
app.use(express.json());

import userRoutes from './routes/user.route.js';
app.use('/api/v1/users', userRoutes);

export default app;