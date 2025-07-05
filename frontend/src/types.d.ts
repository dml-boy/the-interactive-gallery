// src/types.ts

export interface ImageData {
  id: string;
  urls: {
    thumb: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  description?: string;
  user: {
    name: string;
  };
  tags?: { title: string }[];
  likes: number;
  liked: boolean;
  comments?: CommentData[]; // optional, if you fetch with comments
}

export interface CommentData {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
  };
}
