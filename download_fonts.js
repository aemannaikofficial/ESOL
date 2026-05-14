const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE = 'https://esol.education/';

// Font files to download - strip query strings from filenames
const fontFiles = [
    // eicons
    'wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.eot',
    'wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.woff2',
    'wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.woff',
    'wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.ttf',
    'wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.svg',
    // font-awesome solid
    'wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.eot',
    'wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.woff2',
    'wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.woff',
    'wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.ttf',
    'wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.svg',
    // fontawesome main
    'wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-regular-400.woff2',
    'wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-regular-400.woff',
    'wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-regular-400.ttf',
];

const missing = fontFiles.filter(p => !fs.existsSync(p));
console.log(`Downloading ${missing.length} font files...`);

function download(relPath) {
    return new Promise((resolve, reject) => {
        const url = BASE + relPath;
        const destDir = path.dirname(relPath);
        fs.mkdirSync(destDir, { recursive: true });

        function doGet(u) {
            const dest = fs.createWriteStream(relPath);
            https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    dest.destroy();
                    doGet(res.headers.location);
                } else if (res.statusCode === 200) {
                    res.pipe(dest);
                    dest.on('finish', () => { dest.close(); resolve(relPath); });
                    dest.on('error', reject);
                } else {
                    dest.destroy();
                    resolve(relPath + ' (skipped: ' + res.statusCode + ')');
                }
            }).on('error', err => { dest.destroy(); reject(err); });
        }
        doGet(url);
    });
}

(async () => {
    for (const f of missing) {
        try {
            const result = await download(f);
            console.log('OK:', result);
        } catch (e) {
            console.error('FAILED:', f, e.message);
        }
    }
    console.log('\nDone!');
})();
