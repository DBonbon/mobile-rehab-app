// Create file at: frontend/__mocks__/components/images/imageData';

export const mockBaseImage = {
  fullUrl: '/mock-image.jpg',
  original: {
    alt: 'Mock image alt text',
    fullUrl: '/mock-image.jpg',
    srcset: {
      small: { src: '/mock-image-480w.jpg' },
      medium: { src: '/mock-image-768w.jpg' },
      large: { src: '/mock-image-1024w.jpg' },
      extra_large: { src: '/mock-image-1200w.jpg' }
    },
    srcset_webp: {
      small: { src: '/mock-image-480w.webp' },
      medium: { src: '/mock-image-768w.webp' },
      large: { src: '/mock-image-1024w.webp' },
      extra_large: { src: '/mock-image-1200w.webp' }
    }
  },
  thumbnail: {
    alt: 'Mock thumbnail alt text',
    fullUrl: '/mock-thumbnail.jpg',
    srcset: {
      small: { src: '/mock-thumbnail-480w.jpg' },
      medium: { src: '/mock-thumbnail-768w.jpg' },
      large: { src: '/mock-thumbnail-1024w.jpg' },
      extra_large: { src: '/mock-thumbnail-1200w.jpg' }
    }
  }
};

export const mockCarouselImages = [
    {
      id: 1,
      title: 'First Image',
      ...mockBaseImage
    },
    {
      id: 2,
      title: 'Second Image',
      ...mockBaseImage,
      original: {
        ...mockBaseImage.original,
        alt: 'Second carousel image'
      }
    },
    {
      id: 3,
      title: 'Third Image',
      ...mockBaseImage,
      original: {
        ...mockBaseImage.original,
        alt: 'Third carousel image'
      }
    }
  ];

export const mockImageText = {
  reverse: false,
  image: mockBaseImage,
  text: '<p>Sample text content</p>'
};