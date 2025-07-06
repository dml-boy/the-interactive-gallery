import { Request, Response } from 'express';
import { pool } from '../db/pool';

export const postComment = async (req: Request, res: Response): Promise<void> => {
  // allow imageId from either URL param or request body
  const imageId = req.params.imageId ?? req.body.imageId;
  const { content, user_name = 'Anonymous', avatar_url = '' } = req.body;

  if (!imageId) {
    res.status(400).json({ message: 'Missing imageId.' });
    return;
  }

  if (!content || content.trim().length < 3) {
    res.status(400).json({ message: 'Comment too short.' });
    return;
  }

  try {
    const [result]: any = await pool.query(
      'INSERT INTO comments (image_id, content, user_name, avatar_url) VALUES (?, ?, ?, ?)',
      [imageId, content, user_name, avatar_url]
    );

    res.status(201).json({
      id: result.insertId,
      image_id: imageId,
      content,
      user_name,
      avatar_url,
      created_at: new Date(),
    });
  } catch (err: any) {
    console.error('Error posting comment:', err);
    res.status(500).json({ message: 'Failed to post comment.' });
  }
};
export const getComments = async (req: Request, res: Response): Promise<void> => {
  const imageId = req.params.imageId;

  if (!imageId) {
    res.status(400).json({ message: 'Missing imageId.' });
    return;
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM comments WHERE image_id = ? ORDER BY created_at DESC',
      [imageId]
    );

    res.json(rows);
  } catch (err: any) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
};
export const editComment = async (req: Request, res: Response): Promise<void> => {
  const commentId = req.params.commentId;
  const { content } = req.body;

  if (!commentId || !content || content.trim().length < 3) {
    res.status(400).json({ message: 'Invalid request.' });
    return;
  }

  try {
    const [result]: any = await pool.query(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, commentId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Comment not found.' });
      return;
    }

    res.json({ message: 'Comment updated successfully.' });
  } catch (err: any) {
    console.error('Error editing comment:', err);
    res.status(500).json({ message: 'Failed to edit comment.' });
  }
};
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const commentId = req.params.commentId;

  if (!commentId) {
    res.status(400).json({ message: 'Missing commentId.' });
    return;
  }

  try {
    const [result]: any = await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Comment not found.' });
      return;
    }

    res.json({ message: 'Comment deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Failed to delete comment.' });
  }
};