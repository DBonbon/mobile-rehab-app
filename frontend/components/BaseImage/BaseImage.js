import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const BaseImage = ({ 
  image, 
  isThumbnail = false, 
  className = '',
  fit = 'responsive', // Options: 'responsive', 'contain', 'cover', 'fill'
  priority = true
}) => {
    if (!image) {
        console.error('No image data provided to BaseImage component');
        return null;
    }
    
    // Get the API URL from environment variable
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    
    // Extract image data based on structure
    let src, alt, width, height, srcset;
    
    if (image.original) {
        // Complex nested structure with original/thumbnail
        const imageData = isThumbnail && image.thumbnail ? image.thumbnail : image.original;
        src = imageData.full_url || imageData.fullUrl || imageData.src || '';
        alt = imageData.alt || 'Image';
        width = imageData.width || 1200;
        height = imageData.height || 800;
        srcset = image.srcset || imageData.srcset;
    } else if (typeof image === 'object') {
        // Simple object structure
        src = image.full_url || image.fullUrl || image.url || image.src || '';
        alt = image.alt || 'Image';
        width = image.width || 1200;
        height = image.height || 800;
        srcset = image.srcset;
    } else if (typeof image === 'string') {
        // Just a string URL
        src = image;
        alt = 'Image';
        width = 1200;
        height = 800;
    }
    
    // Add API URL prefix if it's a relative path
    if (src && !src.startsWith('http')) {
        src = API_URL + src;
    }
    
    // Prepare srcSet if available
    let srcSetString = '';
    if (srcset) {
        const entries = [];
        
        if (srcset.small?.src) entries.push(`${API_URL}${srcset.small.src} 480w`);
        if (srcset.medium?.src) entries.push(`${API_URL}${srcset.medium.src} 768w`);
        if (srcset.large?.src) entries.push(`${API_URL}${srcset.large.src} 1024w`);
        if (srcset.extra_large?.src) entries.push(`${API_URL}${srcset.extra_large.src} 1200w`);
        
        srcSetString = entries.join(', ');
    }
    
    // Determine styling based on fit prop
    let containerStyle = {};
    let imgStyle = {};
    
    switch (fit) {
        case 'contain':
            containerStyle = { position: 'relative', width: '100%', height: 'auto' };
            imgStyle = { objectFit: 'contain', width: '100%', height: 'auto' };
            break;
        case 'cover':
            containerStyle = { position: 'relative', width: '100%', paddingBottom: `${(height / width) * 100}%` };
            imgStyle = { objectFit: 'cover', position: 'absolute', width: '100%', height: '100%' };
            break;
        case 'fill':
            containerStyle = { position: 'relative', width: '100%', height: '100%' };
            imgStyle = { objectFit: 'cover', width: '100%', height: '100%' };
            break;
        case 'responsive':
        default:
            containerStyle = { position: 'relative', width: '100%', paddingBottom: `${(height / width) * 100}%` };
            imgStyle = { objectFit: 'contain', position: 'absolute', width: '100%', height: '100%' };
    }
    
    // For development: use regular img tag for simpler debugging
    if (process.env.NODE_ENV === 'development') {
        return (
            <div className={className} style={containerStyle}>
                <img
                    src={src}
                    alt={alt}
                    style={imgStyle}
                    srcSet={srcSetString || undefined}
                    onError={(e) => {
                        console.error('Image failed to load:', src);
                        e.target.style.display = 'none';
                    }}
                />
            </div>
        );
    }
    
    // For production: use Next.js Image component
    if (fit === 'fill') {
        // Use fill property for full container coverage
        return (
            <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                    src={src}
                    alt={alt}
                    fill={true}
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    priority={priority}
                    unoptimized={true}
                />
            </div>
        );
    }
    
    // Standard responsive image
    return (
        <div className={className} style={containerStyle}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 85vw, (max-width: 1024px) 75vw, 50vw"
                style={imgStyle}
                srcSet={srcSetString || undefined}
                priority={priority}
                unoptimized={true}
            />
        </div>
    );
};

BaseImage.propTypes = {
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            full_url: PropTypes.string,
            fullUrl: PropTypes.string,
            url: PropTypes.string,
            src: PropTypes.string,
            alt: PropTypes.string,
            width: PropTypes.number,
            height: PropTypes.number,
            srcset: PropTypes.object
        }),
        PropTypes.shape({
            original: PropTypes.shape({
                full_url: PropTypes.string,
                fullUrl: PropTypes.string,
                src: PropTypes.string,
                alt: PropTypes.string,
                width: PropTypes.number,
                height: PropTypes.number,
            }),
            thumbnail: PropTypes.shape({
                full_url: PropTypes.string,
                fullUrl: PropTypes.string,
                src: PropTypes.string,
                alt: PropTypes.string,
                width: PropTypes.number,
                height: PropTypes.number,
            }),
            srcset: PropTypes.object
        }),
    ]).isRequired,
    isThumbnail: PropTypes.bool,
    className: PropTypes.string,
    fit: PropTypes.oneOf(['responsive', 'contain', 'cover', 'fill']),
    priority: PropTypes.bool
};

export default BaseImage;