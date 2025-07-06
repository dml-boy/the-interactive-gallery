import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { pool } from '../db/pool';
import { ImageData } from '../types';

dotenv.config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface UnsplashImage {
  id: string;
  alt_description: string;
  description?: string;
  urls: {
    thumb: string;
    full: string;
  };
  likes: number;
  user: {
    name: string;
  };
  tags?: { title: string }[];
}

interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

export const getImages = async (req: Request, res: Response): Promise<void> => {
  if (!UNSPLASH_ACCESS_KEY) {
    res.status(500).json({ message: 'Unsplash access key not configured' });
    return;
  }

  const query = req.query.q as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt((req.query.perPage || req.query.limit) as string) || 20;

  try {
    let unsplashImages: UnsplashImage[] = [];
    let total = 0;
    let totalPages = 0;

    if (query) {
      const response = await axios.get<UnsplashSearchResponse>(
        'https://api.unsplash.com/search/photos',
        {
          params: { query, page, per_page: perPage },
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      unsplashImages = response.data.results;
      total = response.data.total;
      totalPages = response.data.total_pages;
    } else {
      const response = await axios.get<UnsplashImage[]>(
        'https://api.unsplash.com/photos',
        {
          params: { page, per_page: perPage },
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      unsplashImages = response.data;
      total = 1000; // Rough estimate
      totalPages = 50;
    }

    const imageIds = unsplashImages.map((img) => img.id);

    const likesMap = new Map<string, number>();

    if (imageIds.length > 0) {
      const [likeRows] = await pool.query(
        `SELECT image_id, likes FROM image_likes WHERE image_id IN (${imageIds.map(() => '?').join(',')})`,
        imageIds
      );

      (likeRows as any[]).forEach((row) => {
        likesMap.set(row.image_id, row.likes);
      });
    }

    console.log('✅ Local likes fetched:', Object.fromEntries(likesMap));

    const images: ImageData[] = unsplashImages.map((img) => ({
      id: img.id,
      alt_description: img.alt_description || 'No description',
      description: img.description || '',
      urls: {
        thumb: img.urls.thumb,
        full: img.urls.full,
      },
      user: { name: img.user.name },
      tags: (img.tags || []).map((tag) => ({
        title: tag.title,
        type: 'unspecified',
      })),
      likes: likesMap.get(img.id) ?? img.likes,
      liked: false,
    }));

    res.json({
      images,
      total,
      totalPages,
      page,
    });
  } catch (err: any) {
    console.error('❌ Error fetching images:', err.message);
    res.status(500).json({ message: 'Failed to fetch images from Unsplash' });
  }
};
