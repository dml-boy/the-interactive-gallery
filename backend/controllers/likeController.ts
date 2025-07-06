// 📄 controllers/imageController.ts

import { Request, Response } from 'express';
import { pool } from '../db/pool';

export const likeImage = async (req: Request, res: Response) => {
  const { imageId } = req.params;

  try {
    // Check if image exists in table
    const [existingRows] = await pool.query(
      'SELECT likes FROM image_likes WHERE image_id = ?',
      [imageId]
    );

    if ((existingRows as any[]).length > 0) {
      // Already exists – increment by 1
      await pool.query('UPDATE image_likes SET likes = likes + 1 WHERE image_id = ?', [imageId]);
    } else {
      // New image – insert with 1 like
      await pool.query('INSERT INTO image_likes (image_id, likes) VALUES (?, ?)', [imageId, 1]);
    }

    // Return the updated count
    const [updated] = await pool.query('SELECT likes FROM image_likes WHERE image_id = ?', [imageId]);
    const likes = (updated as any[])[0]?.likes || 1;

    res.json({ imageId, likes });
  } catch (err) {
    console.error('Error in likeImage:', err);
    res.status(500).json({ message: 'Failed to like image' });
  }
};
