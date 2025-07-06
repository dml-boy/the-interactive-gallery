
import React, { useEffect, useState } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faTag, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { ImageData, CommentData } from '../types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface ImageModalProps {
  image: ImageData;
  onClose: () => void;
  onLike: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onLike }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/comments/${image.id}`);
        const normalized: CommentData[] = res.data.map((c: any) => ({
          id: String(c.id),
          content: c.content,
          created_at: c.created_at,
          user: { name: c.user_name || 'Guest' },
        }));
        setComments(normalized);
        setError('');
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [image.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (trimmed.length < 3) {
      setError('Comment must be at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/comments/${image.id}`, {
        content: trimmed,
        user_name: 'Guest',
        avatar_url: '',
      });

      const newCommentData: CommentData = {
        id: String(res.data.id),
        content: res.data.content,
        created_at: res.data.created_at,
        user: { name: res.data.user_name || 'Guest' },
      };

      setComments((prev) => [newCommentData, ...prev]);
      setNewComment('');
      setError('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="pos-modal__header">
        <Modal.Title className="pos-modal__title text-wrap">
          {image.alt_description || 'Untitled Image'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pos-modal__body px-md-4 px-2">
        <div className="text-center mb-4 position-relative">
          <img
            src={image.urls.full}
            alt={image.alt_description || 'Image'}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '60vh', objectFit: 'contain' }}
          />
          <Button
            variant="light"
            className="position-absolute top-0 end-0 m-3 border-0 like-button"
            onClick={onLike}
            aria-pressed={image.liked}
            data-testid="modal-like-button"
          >
            <FontAwesomeIcon
              icon={image.liked ? solidHeart : regularHeart}
              className={image.liked ? 'text-danger' : 'text-secondary'}
            />{' '}
            {image.likes}
          </Button>
        </div>

        <div className="mb-4">
          <strong>Tags:</strong>
          {Array.isArray(image.tags) && image.tags.length > 0 ? (
            <div className="d-flex flex-wrap gap-2 mt-2">
              {image.tags.map((tag, i) => (
                <Badge key={i} bg="light" text="dark" pill className="px-3 py-2 text-sm">
                  <FontAwesomeIcon icon={faTag} className="me-1 text-secondary" /> {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-muted mt-2">
              <FontAwesomeIcon icon={faInfoCircle} className="me-1" /> No tags available.
            </div>
          )}
        </div>

        <div className="border-top pt-3">
          <h5 className="mb-3 d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faCommentDots} /> Comments ({comments.length})
          </h5>

          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : comments.length === 0 ? (
            <p className="text-muted">No comments yet. Be the first to comment!</p>
          ) : (
            <ListGroup variant="flush" className="mb-3">
              {comments.map((comment) => (
                <ListGroup.Item key={comment.id} className="px-0 py-2">
                  <div className="d-flex justify-content-between flex-column flex-md-row">
                    <div>
                      <strong>{comment.user.name}</strong>
                      <p className="mb-1">{comment.content}</p>
                    </div>
                    <small className="text-muted mt-1 mt-md-0 text-end text-md-start">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group controlId="commentInput" className="mb-3">
              <Form.Label className="fw-bold">Add a comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write something..."
                disabled={isSubmitting}
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="text-end">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || newComment.trim().length < 3}
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" /> Posting...
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
};

export default ImageModal;
