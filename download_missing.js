const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://esol.education/';

const missing = JSON.parse(fs.readFileSync('missing_images.json', 'utf8'));

function download(relPath) {
    return new Promise((resolve, reject) => {
        const url = BASE_URL + relPath;
        const destDir = path.dirname(relPath);
        fs.mkdirSync(destDir, { recursive: true });
        const dest = fs.createWriteStream(relPath);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                // follow redirect
                https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res2 => {
                    res2.pipe(dest);
                    dest.on('finish', () => { dest.close(); resolve(relPath); });
                }).on('error', reject);
            } else {
                res.pipe(dest);
                dest.on('finish', () => { dest.close(); resolve(relPath); });
            }
        }).on('error', err => {
            dest.close();
            reject(err);
        });
    });
}

(async () => {
    for (const img of missing) {
        try {
            await download(img);
            console.log('Downloaded:', img);
        } catch (e) {
            console.error('FAILED:', img, e.message);
        }
    }
    console.log('\nDone!');
})();
