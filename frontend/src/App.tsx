// src/App.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import GalleryCard from './Components/GalleryCard';
import ImageModal from './Components/ImageModal';
import './App.css';
import { ImageData } from './types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/images`);
        const imagesWithLiked: ImageData[] = response.data.map((image: ImageData) => ({
          ...image,
          liked: false,
        }));
        setImages(imagesWithLiked);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const openModal = (image: ImageData) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  const handleLike = (imageId: string) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === imageId
          ? { ...img, likes: img.liked ? img.likes - 1 : img.likes + 1, liked: !img.liked }
          : img
      )
    );

    if (selectedImage && selectedImage.id === imageId) {
      setSelectedImage((prev) =>
        prev
          ? {
              ...prev,
              likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
              liked: !prev.liked,
            }
          : null
      );
    }
  };

  return (
    <div className="pos-app container">
      <header className="pos-header">
        <h1>Image Gallery</h1>
      </header>
      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row pos-gallery">
          {images.map((image) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={image.id}>
              <GalleryCard image={image} onClick={() => openModal(image)} />
            </div>
          ))}
        </div>
      )}
      {showModal && selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={closeModal}
          onLike={() => handleLike(selectedImage.id)}
        />
      )}
    </div>
  );
}

export default App;
