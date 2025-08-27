import express from 'express';
import { deleteUrl, getAllUrls, shortCode, shortUrl } from '../controllers/urls.controllers.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/shorturl').post(verifyJWT, shortUrl)
router.route('/codes').get(verifyJWT, getAllUrls)
router.route('/:id').delete(verifyJWT, deleteUrl)
router.route('/:shortCode').get(shortCode)

export default router;