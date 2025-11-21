# Hero Section Background Images

This directory contains background images for the hero section of the website.

## Usage

Place your hero background images here. Recommended formats:
- **WebP** (best performance)
- **JPG/JPEG** (good quality, smaller file size)
- **PNG** (if transparency is needed)

## Recommended Image Specifications

- **Resolution**: 1920x1080 or higher (for high-DPI displays)
- **Aspect Ratio**: 16:9 or wider
- **File Size**: Keep under 500KB for optimal loading
- **Format**: WebP preferred for best compression

## Example Usage in HeroSection Component

```tsx
import Image from 'next/image'

// In your component:
<Image
  src="/images/hero/background.jpg"
  alt="Hero background"
  fill
  className="object-cover"
  priority
/>
```

## File Naming Convention

Use descriptive names:
- `hero-background.jpg`
- `hero-background-mobile.jpg` (for mobile-specific images)
- `hero-background-dark.jpg` (for dark mode variants)

