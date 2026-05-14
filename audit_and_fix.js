const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Read index.html
let content = fs.readFileSync('index.html', 'utf8');

// Fix the × vs x mismatch in the hero image path
// The local file was renamed to use 'x' but the HTML still has '×'
content = content.replace(
    /Reading-Poster-Landscape-42-x-29\.7-cm-50-×-35-cm-1/g,
    'Reading-Poster-Landscape-42-x-29.7-cm-50-x-35-cm-1'
);

fs.writeFileSync('index.html', content);
console.log('Fixed hero image path mismatch (× → x).');

// Now extract all wp-content/uploads image paths that are referenced in index.html
const imgMatches = [...content.matchAll(/["']wp-content\/uploads\/([^"']+\.(png|jpg|jpeg|gif|webp|svg))["']/gi)];
const uniquePaths = [...new Set(imgMatches.map(m => 'wp-content/uploads/' + m[1]))];

console.log(`\nFound ${uniquePaths.length} unique image references in index.html.`);

// Check which ones are missing locally
const missing = uniquePaths.filter(p => !fs.existsSync(p));
console.log(`\nMissing locally: ${missing.length}`);
missing.forEach(p => console.log('  MISSING:', p));

// Save missing list to file
fs.writeFileSync('missing_images.json', JSON.stringify(missing, null, 2));
console.log('\nSaved missing_images.json');
