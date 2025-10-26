#!/usr/bin/env node
/**
 * Image Optimization Script
 *
 * Converts JPG/PNG images to modern formats (AVIF, WebP) with multiple sizes
 * for responsive images.
 *
 * Usage: pnpm img:optimize
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const config = {
  inputDir: join(projectRoot, 'public/images'),
  outputDir: join(projectRoot, 'public/images-optimized'),

  // Formats to generate
  formats: ['avif', 'webp', 'jpg'],

  // Responsive sizes (widths)
  sizes: [640, 768, 1024, 1280, 1920, 2560],

  // Quality settings
  quality: {
    avif: 80,   // AVIF has excellent compression
    webp: 85,   // WebP good compression
    jpg: 90     // JPG fallback with high quality
  },

  // File extensions to process
  extensions: ['.jpg', '.jpeg', '.png'],
};

/**
 * Get all image files from directory recursively
 */
async function getImageFiles(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await getImageFiles(filePath, fileList);
    } else {
      const ext = extname(file).toLowerCase();
      if (config.extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath) {
  const fileName = basename(inputPath, extname(inputPath));
  const relativePath = inputPath.replace(config.inputDir, '').replace(/^\//, '');
  const relativeDir = dirname(relativePath);

  console.log(`\n📸 Processing: ${relativePath}`);

  // Get image metadata
  const metadata = await sharp(inputPath).metadata();
  const originalWidth = metadata.width;
  const originalSize = (await stat(inputPath)).size;

  console.log(`   Original: ${originalWidth}x${metadata.height} (${(originalSize / 1024 / 1024).toFixed(2)} MB)`);

  // Create output directory
  const outputDir = join(config.outputDir, relativeDir);
  await mkdir(outputDir, { recursive: true });

  let totalSavings = 0;

  // Generate responsive sizes
  for (const width of config.sizes) {
    // Skip if size is larger than original
    if (width > originalWidth) continue;

    const image = sharp(inputPath).resize(width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });

    // Generate each format
    for (const format of config.formats) {
      const outputPath = join(outputDir, `${fileName}-${width}w.${format}`);

      let outputImage = image.clone();

      switch (format) {
        case 'avif':
          outputImage = outputImage.avif({ quality: config.quality.avif });
          break;
        case 'webp':
          outputImage = outputImage.webp({ quality: config.quality.webp });
          break;
        case 'jpg':
          outputImage = outputImage.jpeg({ quality: config.quality.jpg, mozjpeg: true });
          break;
      }

      await outputImage.toFile(outputPath);

      const outputSize = (await stat(outputPath)).size;
      const savings = originalSize - outputSize;
      totalSavings += savings;

      console.log(`   ✓ ${width}w.${format}: ${(outputSize / 1024).toFixed(1)} KB`);
    }
  }

  console.log(`   💾 Total savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB`);

  return totalSavings;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log(`Input:  ${config.inputDir}`);
  console.log(`Output: ${config.outputDir}`);
  console.log(`Formats: ${config.formats.join(', ')}`);
  console.log(`Sizes: ${config.sizes.join('w, ')}w`);

  try {
    // Create output directory
    await mkdir(config.outputDir, { recursive: true });

    // Get all images
    const images = await getImageFiles(config.inputDir);
    console.log(`\n📁 Found ${images.length} images to process`);

    if (images.length === 0) {
      console.log('❌ No images found to optimize');
      return;
    }

    // Process each image
    let totalSavings = 0;
    for (const imagePath of images) {
      const savings = await optimizeImage(imagePath);
      totalSavings += savings;
    }

    console.log('\n✅ Optimization complete!');
    console.log(`💾 Total space saved: ${(totalSavings / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n📂 Optimized images: ${config.outputDir}`);
    console.log('\nNext steps:');
    console.log('1. Review optimized images in public/images-optimized/');
    console.log('2. Update components to use <picture> with srcset');
    console.log('3. Move optimized images to public/images/ (backup originals first!)');

  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

main();
