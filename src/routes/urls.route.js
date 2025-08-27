import express from 'express';
import { shortUrl } from '../controllers/urls.controllers.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/shorturl').post(verifyJWT, shortUrl)

export default router;