// src/types.ts

// export interface Tag {
//   title: string;
//   type?: string; // optional now
//   source?: any;
// }

export interface CommentData {
  id: string;
  content: string;
  created_at: string;
  user: { name: string };
}

export interface ImageData {
  id: string;
  urls: {
    thumb: string;
    small?: string;
    regular?: string;
    full?: string;
  };
  alt_description?: string;
  description?: string;
  user?: {
    name: string;
  };
  tags?: string[];
  likes: number;
  comments?: string[];
  liked?: boolean;
}
interface ImageModalProps {
  image: ImageData;
  onClose: () => void;
  onLike: () => void;
    onUpdateImage: (updatedImage: ImageData) => void;
}
