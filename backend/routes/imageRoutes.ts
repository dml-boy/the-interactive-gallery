// 📄 routes/imageRoutes.ts
import { Router } from 'express';
import { getComments, postComment } from '../controllers/commentController';

const router = Router();

// Aliased routes for compatibility
router.get('/:imageId/comments', getComments);
router.post('/:imageId/comments', postComment);

export default router;
