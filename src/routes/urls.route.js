import express from 'express';
import { getAllUrls, shortCode, shortUrl } from '../controllers/urls.controllers.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/shorturl').post(verifyJWT, shortUrl)
router.route('/codes').get(verifyJWT, getAllUrls)
router.route('/:shortCode').get(shortCode)

export default router;