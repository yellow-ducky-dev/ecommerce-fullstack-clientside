import React from 'react';

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%239ca3af'%3ENo image%3C/text%3E%3C/svg%3E";

const OptimizedImage = ({
  src,
  alt = 'Image',
  optWidth = 300,       // Default optimization width
  optQuality = 75,      // Default quality
  loading = 'lazy',     // Native lazy loading by default
  decoding = 'async',   // Non-blocking decoding by default
  ...rest               // Catches style, className, fetchpriority, onMouseEnter, etc.
}) => {
  
  // Helper to optimize Unsplash URLs dynamically
  const getOptimizedUrl = (url, width, quality) => {
    if (!url) return FALLBACK;
    if (url.includes('images.unsplash.com')) {
      try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('w', width.toString());
        urlObj.searchParams.set('q', quality.toString());
        urlObj.searchParams.set('fm', 'webp');
        urlObj.searchParams.set('fit', 'crop');
        return urlObj.toString();
      } catch (e) {
        return url;
      }
    }
    return url;
  };

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK;
  };

  return (
    <img
      src={getOptimizedUrl(src, optWidth, optQuality)}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={handleImgError}
      {...rest}
    />
  );
};

export default OptimizedImage;