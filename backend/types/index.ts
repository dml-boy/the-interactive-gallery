// 📄 types/index.ts
export interface Image {
  id: string;
  urls: {
    thumb: string;
    full: string;
  };
  alt_description: string;
  description?: string;
  user: {
    name: string;
  };
  likes: number;
  liked?: boolean;
}

export interface Comment {
  id?: number;
  image_id: string;
  content: string;
  user_name: string;
  created_at?: string;
}