import express from 'express';

const app = express();

// application-level middleware
app.use(express.json());

import userRoutes from './routes/user.route.js';
import urlRoutes from './routes/urls.route.js';

// routes level middleware
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/urls', urlRoutes);


export default app;