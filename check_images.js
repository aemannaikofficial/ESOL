const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const liveHtml = fs.readFileSync('live_site.html', 'utf8');

function extractImages(html) {
    const imgRegex = /<img[^>]+src="([^"]+)"/g;
    const images = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        images.push(match[1]);
    }
    return images;
}

const indexImages = extractImages(indexHtml);
const liveImages = extractImages(liveHtml);

console.log('--- Images in index.html ---');
indexImages.slice(0, 10).forEach(i => console.log(i));
console.log('\n--- Images in live_site.html ---');
liveImages.slice(0, 10).forEach(i => console.log(i));
