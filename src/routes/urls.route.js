import express from 'express';
import { shortCode, shortUrl } from '../controllers/urls.controllers.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/shorturl').post(verifyJWT, shortUrl)
router.route('/:shortCode').get(shortCode)

export default router;