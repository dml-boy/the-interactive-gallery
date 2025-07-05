// src/Components/ImageModal.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  Button,
  Form,
  ListGroup,
  Alert,
  Spinner,
  Badge,
} from 'react-bootstrap';
import { ImageData, CommentData } from '../types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface ImageModalProps {
  image: ImageData;
  onClose: () => void;
  onLike: () => void;
}

function ImageModal({ image, onClose, onLike }: ImageModalProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/comments/${image.id}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [image.id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const trimmed = newComment.trim();

    if (trimmed.length < 3) {
      setError('Comment must be at least 3 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/comments`, {
        imageId: image.id,
        content: trimmed,
      });
      setComments([response.data, ...comments]);
      setNewComment('');
      setError('');
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show onHide={onClose} size="lg" centered scrollable className="animate__animated animate__fadeIn">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-5">{image.alt_description || 'Untitled Image'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <div className="text-center mb-3 position-relative">
          <img
            src={image.urls.full}
            alt={image.alt_description}
            className="img-fluid rounded-3"
            style={{ maxHeight: '60vh', objectFit: 'contain' }}
          />
          <Button
            variant={image.liked ? 'danger' : 'outline-danger'}
            className="position-absolute top-0 end-0 m-3"
            onClick={onLike}
            aria-label="Like image"
          >
            <i className={`fas fa-heart ${image.liked ? 'text-white' : ''}`}></i> {image.likes}
          </Button>
        </div>

        <div className="mb-4">
          <p className="mb-2">
            <strong>Photographer:</strong> {image.user.name}
          </p>
          {image.description && <p className="text-muted mb-3">{image.description}</p>}
          {Array.isArray(image.tags) && image.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {image.tags.map((tag, i) => (
                <Badge key={i} bg="light" text="dark" pill>
                  {tag.title}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="border-top pt-3">
          <h5 className="mb-3">Comments ({comments.length})</h5>

          {loadingComments ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : comments.length === 0 ? (
            <p className="text-muted">No comments yet. Be the first to comment!</p>
          ) : (
            <ListGroup variant="flush" className="mb-3">
              {comments.map((comment) => (
                <ListGroup.Item key={comment.id} className="px-0 py-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{comment.user.name}</strong>
                      <p className="mb-1">{comment.content}</p>
                    </div>
                    <small className="text-muted">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <Form onSubmit={handleCommentSubmit} className="mt-3">
            <Form.Group controlId="commentInput" className="mb-3">
              <Form.Label>Add your comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this image..."
                disabled={isSubmitting}
              />
            </Form.Group>
            {error && <Alert variant="danger" className="py-2">{error}</Alert>}
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || newComment.trim().length < 3}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status">
                      <span className="visually-hidden">Posting...</span>
                    </Spinner>
                    <span className="ms-2">Posting...</span>
                  </>
                ) : (
                  'Post Comment'
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ImageModal;
