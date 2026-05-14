const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE_URL = 'https://esol.education/';

// Read index.html
const content = fs.readFileSync('index.html', 'utf8');

// Extract all local wp-content and wp-includes CSS/JS references
const refs = [...content.matchAll(/["']((?:wp-content|wp-includes)\/[^"'?]+\.(css|js))(?:\?[^"']*)?["']/gi)];
const uniquePaths = [...new Set(refs.map(m => m[1]))];

console.log(`Found ${uniquePaths.length} unique CSS/JS references.`);

const missing = uniquePaths.filter(p => !fs.existsSync(p));
console.log(`Missing: ${missing.length}`);
missing.forEach(p => console.log('  MISSING:', p));

function download(relPath) {
    return new Promise((resolve, reject) => {
        const url = BASE_URL + relPath;
        const destDir = path.dirname(relPath);
        fs.mkdirSync(destDir, { recursive: true });
        const dest = fs.createWriteStream(relPath);

        function doGet(u) {
            const mod = u.startsWith('https') ? https : http;
            mod.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
                if (res.statusCode === 301 || res.statusCode === 302) {
                    doGet(res.headers.location);
                } else {
                    res.pipe(dest);
                    dest.on('finish', () => { dest.close(); resolve(relPath); });
                }
            }).on('error', reject);
        }
        doGet(url);
    });
}

(async () => {
    for (const f of missing) {
        try {
            await download(f);
            console.log('Downloaded:', f);
        } catch (e) {
            console.error('FAILED:', f, e.message);
        }
    }
    console.log('\nDone!');
})();
