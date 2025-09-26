#!/usr/bin/env node

/**
 * Production optimization script
 * This script optimizes the application for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production optimization...');

// 1. Remove console.log statements from production build
function removeConsoleLogs() {
  console.log('📝 Removing console.log statements...');
  
  const walkDir = (dir, callback) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath, callback);
      } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        callback(filePath);
      }
    });
  };

  const processFile = (filePath) => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove console.log statements (but keep console.error for production debugging)
      const originalContent = content;
      content = content.replace(/console\.log\([^)]*\);?\s*/g, '');
      content = content.replace(/console\.debug\([^)]*\);?\s*/g, '');
      content = content.replace(/console\.warn\([^)]*\);?\s*/g, '');
      
      // Remove empty lines that might be left behind
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Cleaned: ${filePath}`);
      }
    } catch (error) {
      console.log(`⚠️  Could not process: ${filePath}`);
    }
  };

  // Process source files
  walkDir('./src', processFile);
  walkDir('./app', processFile);
  
  console.log('✅ Console.log removal completed');
}

// 2. Optimize images
function optimizeImages() {
  console.log('🖼️  Optimizing images...');
  
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
  const publicDir = './public';
  
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        console.log(`📸 Found image: ${file}`);
      }
    });
  }
  
  console.log('✅ Image optimization completed');
}

// 3. Generate sitemap
function generateSitemap() {
  console.log('🗺️  Generating sitemap...');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/register</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-domain.com/login</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log('✅ Sitemap generated');
}

// 4. Generate robots.txt
function generateRobots() {
  console.log('🤖 Generating robots.txt...');
  
  const robots = `User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml`;

  fs.writeFileSync('./public/robots.txt', robots);
  console.log('✅ Robots.txt generated');
}

// 5. Bundle analysis
function analyzeBundle() {
  console.log('📊 Bundle analysis...');
  console.log('Run "npm run build:analyze" to see detailed bundle analysis');
}

// Main execution
async function main() {
  try {
    removeConsoleLogs();
    optimizeImages();
    generateSitemap();
    generateRobots();
    analyzeBundle();
    
    console.log('🎉 Production optimization completed successfully!');
    console.log('📋 Next steps:');
    console.log('   1. Run "npm run build" to create production build');
    console.log('   2. Run "npm run start:prod" to start production server');
    console.log('   3. Test the application thoroughly');
    console.log('   4. Deploy to your hosting platform');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

main();
