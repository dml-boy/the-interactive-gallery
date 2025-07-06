
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { ImageData } from '../types';

interface GalleryCardProps {
  image: ImageData;
  onClick: () => void;
  onLike: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ image, onClick, onLike }) => {
  return (
    <div
      className="gallery-card rounded shadow-sm bg-white overflow-hidden"
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      role="button"
      tabIndex={0}
    >
      <Card className="border-0">
        <Card.Img
          variant="top"
          src={image.urls.thumb}
          alt={image.alt_description || 'Gallery image'}
          className="img-fluid"
          style={{ cursor: 'pointer', objectFit: 'cover' }}
        />

        <Card.Body className="p-2 pt-3 d-flex flex-column gap-2">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted text-truncate w-75">
              {image.user?.name || 'Unknown'}
            </small>
            <Button
              variant={image.liked ? 'danger' : 'outline-secondary'}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              aria-pressed={image.liked}
              className="d-flex align-items-center gap-1"
              data-testid="like-button"
            >
              <FontAwesomeIcon icon={faHeart} />
              {image.likes}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default React.memo(GalleryCard);
