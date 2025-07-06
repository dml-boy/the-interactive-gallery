
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import Masonry from 'react-masonry-css';
import GalleryCard from './Components/GalleryCard';
import ImageModal from './Components/ImageModal';
import { ImageData } from './types';
import './App.css';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const IMAGES_PER_PAGE = 12;

  useEffect(() => {
    fetchImages(page, true);
  }, [page]);

  const fetchImages = async (pageNum = 1, reset = false) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/images?page=${pageNum}&limit=${IMAGES_PER_PAGE}&search=${searchTerm}`
      );

      const data = res.data.images ?? [];
      const likedImageIds = JSON.parse(localStorage.getItem('likedImages') || '[]');

      const newImages: ImageData[] = data.map((img: ImageData) => ({
        ...img,
        liked: likedImageIds.includes(img.id),
        comments: img.comments || [],
      }));

      if (reset) {
        setImages(newImages);
      } else {
        setImages((prev) => [...prev, ...newImages]);
      }

      setTotalPages(res.data.totalPages || 1);
    } catch (err: any) {
      console.error('Error fetching images:', err.response?.data || err.message);
      setError('Failed to fetch images.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchImages(1, true);
  };

  const openModal = (image: ImageData) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  const handleLike = async (imageId: string) => {
    const likedImages = JSON.parse(localStorage.getItem('likedImages') || '[]');
    const isLiked = likedImages.includes(imageId);

    const updatedLikedImages = isLiked
      ? likedImages.filter((id: string) => id !== imageId)
      : [...likedImages, imageId];

    localStorage.setItem('likedImages', JSON.stringify(updatedLikedImages));

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === imageId
          ? {
              ...img,
              liked: !img.liked,
              likes: img.liked ? img.likes - 1 : img.likes + 1,
            }
          : img
      )
    );

    if (selectedImage?.id === imageId) {
      setSelectedImage((prev) =>
        prev
          ? {
              ...prev,
              liked: !prev.liked,
              likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
            }
          : null
      );
    }

    try {
      await axios.post(`${BASE_URL}/api/images/${imageId}/like`);
    } catch (err: any) {
      console.error('Failed to like image:', err);
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Container fluid className="py-4 px-0" style={{ backgroundColor: '#f5f5f5', maxWidth: 'none' }}>
      <div className="px-4">
        <h1 className="mb-4 text-center">Interactive Gallery</h1>

        <Form onSubmit={handleSearch} className="mb-4 mx-auto" style={{ maxWidth: '600px' }}>
          <Form.Group controlId="searchInput" className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-0"
            />
            <Button type="submit" className="ms-2 rounded-0">
              Search
            </Button>
          </Form.Group>
        </Form>

        {loading && images.length === 0 && (
          <div className="text-center my-5" data-testid="spinner">
            <Spinner animation="border" />
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mx-auto" style={{ maxWidth: '600px' }}>
            {error}
          </Alert>
        )}

        {images.length === 0 && !loading && !error && (
          <Alert variant="info" className="mx-auto" style={{ maxWidth: '600px' }}>
            No images found.
          </Alert>
        )}
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid px-4"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((img) => (
          <GalleryCard
            key={img.id}
            image={img}
            onClick={() => openModal(img)}
            onLike={() => handleLike(img.id)}
          />
        ))}
      </Masonry>

      <div className="d-flex justify-content-center my-4 gap-3">
        <Button
          variant="secondary"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-0"
        >
          ← Prev
        </Button>

        <span className="align-self-center">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="secondary"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-0"
        >
          Next →
        </Button>
      </div>

      {showModal && selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={closeModal}
          onLike={() => handleLike(selectedImage.id)}
        />
      )}
    </Container>
  );
}

export default App;
