
// 📄 controllers/imageController.ts
import { Request, Response } from 'express';
import { Image } from '../types';
import fs from 'fs';

export const getImages = async (_req: Request, res: Response) => {
  try {
    const data = fs.readFileSync('images.json', 'utf-8');
    const images: Image[] = JSON.parse(data);
    res.json(images);
  } catch (err) {
    console.error('Error reading image file:', err);
    res.status(500).json({ message: 'Failed to load images.' });
  }
};
