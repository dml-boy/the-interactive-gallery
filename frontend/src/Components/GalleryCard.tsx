// src/Components/GalleryCard.tsx

import React from 'react';
import { ImageData } from '../types';

interface GalleryCardProps {
  image: ImageData;
  onClick: () => void;
}

function GalleryCard({ image, onClick }: GalleryCardProps) {
  return (
    <div className="pos-card" onClick={onClick}>
      <div className="pos-card__thumb">
        <img
          src={image.urls.regular}
          alt={image.alt_description}
          className="pos-card__img"
          loading="lazy"
        />
      </div>
      <div className="pos-card__content">
        <span className="pos-card__title">{image.alt_description || 'Untitled'}</span>
        <div className="pos-card__stats">
          <span>
            <i className="fas fa-heart"></i> {image.likes}
          </span>
          <span>
            <i className="fas fa-comment"></i> {image.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GalleryCard;
