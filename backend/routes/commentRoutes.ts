// 📄 routes/commentRoutes.ts
import { Router } from 'express';
import {
  getComments,
  postComment,
  editComment,
  deleteComment,
} from '../controllers/commentController';

const router = Router();

router.get('/:imageId', getComments);
router.post('/:imageId', postComment);
router.patch('/:commentId', editComment);
router.delete('/:commentId', deleteComment);

export default router;
