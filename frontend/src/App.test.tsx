
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';
import { ImageData } from './types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockImages: ImageData[] = [
  {
    id: 'img1',
    alt_description: 'Test Image 1',
    description: 'Description 1',
    urls: {
      thumb: 'https://example.com/thumb1.jpg',
      full: 'https://example.com/full1.jpg',
    },
    user: { name: 'User One' },
    tags: [],
    likes: 5,
    liked: false,
    comments: [],
  },
  {
    id: 'img2',
    alt_description: 'Test Image 2',
    description: 'Description 2',
    urls: {
      thumb: 'https://example.com/thumb2.jpg',
      full: 'https://example.com/full2.jpg',
    },
    user: { name: 'User Two' },
    tags: [],
    likes: 3,
    liked: true,
    comments: [],
  },
];

describe('Interactive Gallery App', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/api/images')) {
        return Promise.resolve({
          data: {
            images: mockImages,
            totalPages: 1,
            page: 1,
          },
        });
      }
      if (url.includes('/api/comments')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Not found'));
    });
    mockedAxios.post.mockResolvedValue({});
    localStorage.setItem('likedImages', JSON.stringify(['img2']));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders app and loads images', async () => {
    let resolveAxios: (value: any) => void;
    mockedAxios.get.mockImplementationOnce(
      () => new Promise((resolve) => {
        resolveAxios = resolve;
      })
    );
    render(<App />);
    expect(screen.getByText(/interactive gallery/i)).toBeInTheDocument();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    resolveAxios!({
      data: { images: mockImages, totalPages: 1, page: 1 },
    });

    await waitFor(() => {
      expect(screen.getByAltText('Test Image 1')).toBeInTheDocument();
      expect(screen.getByAltText('Test Image 2')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('like-button')).toHaveLength(2);
  });

  test('handles search input', async () => {
    render(<App />);
    await waitFor(() => screen.getByAltText('Test Image 1'), { timeout: 2000 }); // Wait for initial render

    mockedAxios.get.mockClear();
    mockedAxios.get.mockResolvedValue({
      data: { images: mockImages, totalPages: 1, page: 1 },
    });

    const input = screen.getByPlaceholderText(/search images/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'cats' } });
    fireEvent.click(button);

    await waitFor(
      () => {
        console.log('axios.get calls:', mockedAxios.get.mock.calls);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:3001/api/images?page=1&limit=12&search=cats'
        );
      },
      { timeout: 2000 }
    );
  });

  test('toggles like button', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByAltText('Test Image 1')).toBeInTheDocument();
    });

    const likeButtons = screen.getAllByTestId('like-button');
    fireEvent.click(likeButtons[0]);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/images/img1/like'
      );
    });
  });
});
