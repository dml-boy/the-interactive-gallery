import express from 'express';
import { getImages } from '../controllers/imageController';
import { likeImage } from '../controllers/likeController';

const router = express.Router();

router.post('/:imageId/like', likeImage);  // ✅ POST /api/images/:imageId/like
router.get('/', getImages);

console.log('✅ imageRoutes loaded');

export default router;
