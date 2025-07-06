// Internal format of images used in the app
export interface ImageData {
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
  tags?: Tag[];               // ⬅️ Strong typing over `any[]`
  comments?: Comment[];       // Optional — loaded separately
}

// Unsplash image object from API
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

// Response format for Unsplash search API
interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

// Tag from Unsplash
export interface Tag {
  type: string;
  title: string;
  source?: any; // or define more structure if needed
}

// Comment structure used internally and in database
export interface Comment {
  id?: number;
  imageId: string;
  content: string;
  userName: string;
  createdAt?: string;
  edited?: boolean;
}



