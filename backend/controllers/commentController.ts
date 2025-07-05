// 📄 controllers/commentController.ts
import { Request, Response } from 'express';
import { pool } from '../db/pool';

export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(
      'SELECT id, image_id, content, user_name, avatar_url, created_at, updated_at FROM comments WHERE image_id = ? ORDER BY created_at DESC',
      [req.params.imageId]
    );
    res.json(rows);
  } catch (err: any) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ message: 'Failed to load comments.' });
  }
};

export const postComment = async (req: Request, res: Response): Promise<void> => {
  const imageId = req.params.imageId;
  const { content, user_name = 'Anonymous', avatar_url = '' } = req.body;

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
    console.error('Error posting comment:', err.message);
    res.status(500).json({ message: 'Failed to post comment.' });
  }
};

export const editComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length < 3) {
    res.status(400).json({ message: 'Content too short to update.' });
    return;
  }

  try {
    await pool.query(
      'UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content, commentId]
    );
    res.status(200).json({
      message: 'Comment updated.',
      updated_at: new Date(),
      content,
    });
  } catch (err: any) {
    console.error('Edit comment failed:', err.message);
    res.status(500).json({ message: 'Failed to update comment.' });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  try {
    await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);
    res.status(200).json({ message: 'Comment deleted.' });
  } catch (err: any) {
    console.error('Delete comment failed:', err.message);
    res.status(500).json({ message: 'Failed to delete comment.' });
  }
};
