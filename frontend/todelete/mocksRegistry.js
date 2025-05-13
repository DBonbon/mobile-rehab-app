// __mocks__/mockRegistry.js
// A registry mapping component/page names to their mock data schemas
export const mockRegistry = {
    // Example for specific pages
    AboutPage: {
      streamBlocks: [
        {
          type: 'heroBlock',
          data: {
            title: 'string',
            subtitle: 'string',
            image: {
              src: 'string',
              alt: 'string',
              width: 'number',
              height: 'number'
            },
            cta: {
              label: 'string',
              url: 'string'
            }
          }
        },
        {
          type: 'imageGallery',
          data: {
            title: 'string',
            images: [
              {
                src: 'string',
                alt: 'string',
                caption: 'string?', // Optional field
                width: 'number',
                height: 'number'
              },
              3 // Generate 3 items with this structure
            ]
          }
        }
      ],
      // Other AboutPage specific props
      testimonials: [
        {
          author: 'string',
          role: 'string',
          quote: 'string',
          avatar: 'string?'
        },
        2 // Generate 2 testimonials
      ]
    },
    // Add more component/page specific schemas as needed
  };
  
  // Type definitions for common complex structures
  export const complexTypeDefinitions = {
    // Common complex types used across components
    streamBlock: {
      _schemaType: 'union',
      _variants: [
        {
          type: 'textBlock',
          data: {
            title: 'string?',
            content: 'string',
            alignment: {
              _schemaType: 'oneOf',
              _options: ['left', 'center', 'right']
            }
          }
        },
        {
          type: 'imageBlock',
          data: {
            image: {
              src: 'string',
              alt: 'string',
              width: 'number',
              height: 'number'
            },
            caption: 'string?'
          }
        },
        {
          type: 'videoBlock',
          data: {
            videoUrl: 'string',
            thumbnailUrl: 'string',
            autoplay: 'boolean',
            caption: 'string?'
          }
        },
        {
          type: 'carouselBlock',
          data: {
            slides: [
              {
                title: 'string?',
                image: {
                  src: 'string',
                  alt: 'string'
                },
                content: 'string?'
              },
              3
            ],
            settings: {
              autoplay: 'boolean',
              interval: 'number',
              indicators: 'boolean',
              arrows: 'boolean'
            }
          }
        }
      ]
    },
    
    // Navigation item (recursive structure)
    navigationItem: {
      title: 'string',
      url: 'string?',
      icon: 'string?',
      children: {
        _schemaType: 'recursiveArray',
        _baseType: 'self', // References this same type
        _depth: 2, // Max depth for recursion
        _count: [0, 3] // Random count between 0-3 items
      }
    },
    
    // SEO object expanded definition
    seoObject: {
      seoHtmlTitle: 'string',
      seoMetaDescription: 'string',
      seoOgTitle: 'string?',
      seoOgDescription: 'string?',
      seoOgUrl: 'string?',
      seoOgImage: {
        src: 'string?',
        alt: 'string?',
        width: 'number?',
        height: 'number?'
      },
      seoOgType: {
        _schemaType: 'oneOf',
        _options: ['website', 'article', 'product']
      },
      seoTwitterTitle: 'string?',
      seoTwitterDescription: 'string?',
      seoTwitterImage: {
        src: 'string?',
        alt: 'string?'
      },
      seoMetaRobots: {
        index: 'boolean',
        follow: 'boolean',
        value: 'string'
      },
      canonicalLink: 'string?'
    }
  };