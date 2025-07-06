import { Router } from 'express';
import {
  getComments,
  postComment,
  editComment,
  deleteComment
} from '../controllers/commentController';

const router = Router();

// fetch comments for a given image
router.get('/:imageId', getComments);

// two ways to post:
//  • POST /api/comments/:imageId
//  • POST /api/comments  (with { imageId, content, … } in JSON body)
router.post('/:imageId', postComment);
router.post('/', postComment);

router.patch('/:commentId', editComment);
router.delete('/:commentId', deleteComment);

export default router;
