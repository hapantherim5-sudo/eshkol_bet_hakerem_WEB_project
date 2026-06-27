// File: scripts/generate-gallery-images.js
// Purpose: generate-gallery-images script
// Role: project scripting helper

import https from 'https';
import fs from 'fs';
import path from 'path';
import process from 'node:process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// High-quality, thematic image URLs from Unsplash with search parameters
const galleryImages = [
  {
    id: 1,
    filename: 'youth-football-training.png',
    query: 'young people football soccer training diverse team',
    caption: 'Youth football training - community sports'
  },
  {
    id: 2,
    filename: 'youth-art-workshop.png',
    query: 'youth art class painting drawing workshop creative',
    caption: 'Art workshop - youth creativity'
  },
  {
    id: 3,
    filename: 'community-garden-volunteering.png',
    query: 'volunteers gardening community outdoor young people',
    caption: 'Community garden volunteering'
  },
  {
    id: 4,
    filename: 'youth-science-learning.png',
    query: 'young people science lab STEM education learning',
    caption: 'Science learning - youth education'
  },
  {
    id: 5,
    filename: 'community-event-gathering.png',
    query: 'community event celebration youth gathering diverse',
    caption: 'Community event celebration'
  },
  {
    id: 6,
    filename: 'youth-basketball-tournament.png',
    query: 'youth basketball game team sport competition',
    caption: 'Basketball tournament - teamwork'
  },
  {
    id: 7,
    filename: 'music-workshop-drums.png',
    query: 'music workshop youth drums percussion band',
    caption: 'Music workshop - drums and instruments'
  },
  {
    id: 8,
    filename: 'community-cleanup-volunteers.png',
    query: 'volunteers cleanup community park environmental',
    caption: 'Community cleanup - environmental volunteering'
  },
  {
    id: 9,
    filename: 'youth-coding-workshop.png',
    query: 'young people coding programming laptop technology education',
    caption: 'Coding workshop - tech education'
  },
  {
    id: 10,
    filename: 'youth-festival-celebration.png',
    query: 'youth festival celebration performance crowd diverse',
    caption: 'Youth festival - community celebration'
  },
  {
    id: 11,
    filename: 'youth-dance-performance.png',
    query: 'youth dance performance stage show entertainment',
    caption: 'Dance performance - youth expression'
  },
  {
    id: 12,
    filename: 'nature-hiking-group.png',
    query: 'young people hiking nature group outdoor adventure',
    caption: 'Nature hiking - group activity'
  }
];

// Using Unsplash API (free, high quality, no API key needed for simple requests)
// We'll use direct Unsplash download links with search terms
function getUnsplashImageUrl(query, width = 600, height = 450) {
  // Unsplash source endpoint - returns a random image based on search query
  const encoded = encodeURIComponent(query);
  return `https://source.unsplash.com/${width}x${height}/?${encoded}`;
}

// downloadImage — handles downloadImage
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '..', 'public', 'gallery', filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${filename}`);
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// generateGalleryImages — handles generateGalleryImages
async function generateGalleryImages() {
  console.log('🎨 Generating gallery images...\n');
  
  const heights = [420, 700, 450, 400, 600, 440, 500, 420, 480, 520, 600, 450];
  
  try {
    for (let i = 0; i < galleryImages.length; i++) {
      const img = galleryImages[i];
      const height = heights[i];
      const url = getUnsplashImageUrl(img.query, 600, height);
      
      console.log(`[${i + 1}/12] Fetching: ${img.caption}`);
      await downloadImage(url, img.filename);
      
      // Small delay between requests to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n✅ All gallery images generated successfully!\n');
    console.log('📝 Update your GalleryPage.jsx with these new image paths:');
    console.log('   src: `/gallery/${filename}`\n');
    
  } catch (error) {
    console.error('❌ Error generating images:', error.message);
    process.exit(1);
  }
}

generateGalleryImages();
