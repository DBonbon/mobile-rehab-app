# Feature Template

## Session Info
Related PRs: N/A
Epic: #[epic-number]

## Context
Enhanced the BaseImage component to properly handle responsive images across different screen sizes while maintaining aspect ratios. Fixed issues with image URLs and added flexible display options for different use cases throughout the application.

## Requirements
- Support different image fitting modes (responsive, contain, cover, fill)
- Maintain correct aspect ratios of images
- Automatically handle API URL prefixing for image paths
- Support both camelCase and snake_case property naming in the API response
- Handle responsive sizing based on screen size
- Support srcset for optimized image loading

## Technical Notes
The enhanced BaseImage component provides several key improvements:

### BaseImage Component Updates
```javascript
// New props
const BaseImage = ({ 
  image, 
  isThumbnail = false, 
  className = '',
  fit = 'responsive', // Options: 'responsive', 'contain', 'cover', 'fill'
  priority = true
}) => {
  // Component logic
}
```

### Fit Options
- `responsive` (default): Maintains aspect ratio and scales to fit container width
- `contain`: Ensures the entire image is visible within the container
- `cover`: Fills the container completely, possibly cropping the image
- `fill`: Takes up 100% of the parent container's dimensions

### Example Usage

1. **Hero/Banner Image** (full width, cover mode):
```jsx
<BaseImage
  image={heroImage}
  fit="cover"
  className="w-full h-96"
/>
```

2. **Thumbnail in a Grid** (square crop):
```jsx
<div className="h-48 w-48">
  <BaseImage
    image={thumbnailImage}
    fit="fill"
    isThumbnail={true}
  />
</div>
```

3. **Gallery Image** (maintain aspect ratio):
```jsx
<BaseImage
  image={galleryImage}
  fit="responsive"
  className="rounded-lg overflow-hidden"
/>
```

4. **Profile/Avatar** (circular crop):
```jsx
<div className="rounded-full overflow-hidden h-16 w-16">
  <BaseImage
    image={avatarImage}
    fit="fill"
  />
</div>
```

5. **For Image Carousel**:
```jsx
{value.map((image, index) => (
  <div key={index} className="h-[90vh] flex items-center justify-center">
    <BaseImage
      image={image}
      fit="contain"
      className="w-full h-full"
    />
  </div>
))}
```

### Environment Configuration
Required environment variable:
```
NEXT_PUBLIC_API_URL=http://api.local.test:8000
```

### Next.js Configuration
```javascript
// next.config.js
images: {
  domains: ['localhost', 'api.local.test'],
  // Add other domains as needed
},
```

## Acceptance Criteria
- [x] Images display properly on all screen sizes (mobile, tablet, desktop)
- [x] Image aspect ratios are maintained correctly
- [x] All image URLs are properly formed with the API base URL
- [x] Different fitting modes work as expected
- [x] Component handles various API response formats gracefully
- [x] Error handling for images that fail to load
- [x] Support for srcset is implemented if available from API

## Dependencies
- Next.js Image component
- Environment variable for API URL
- Next.js config update for image domains

## References
- [Next.js Image Documentation](https://nextjs.org/docs/api-reference/next/image)
- [Responsive Images Best Practices](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

## Tags
feature, responsive-images, ui-component, optimization