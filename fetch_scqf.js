const https = require('https');
const fs = require('fs');

// Try fetching the SCQF page
const urls = [
    'https://esol.education/scqf-levels/',
    'https://esol.education/english-levels/',
    'https://esol.education/levels/',
    'https://esol.education/scqf-english-levels/'
];

function tryUrl(index) {
    if (index >= urls.length) {
        console.log('All URLs tried');
        return;
    }
    const url = urls[index];
    console.log('Trying:', url);
    https.get(url, (res) => {
        console.log('Status:', res.statusCode, 'for', url);
        if (res.statusCode === 200) {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                fs.writeFileSync('scqf_live.html', data);
                console.log('Saved! Length:', data.length);
            });
        } else {
            tryUrl(index + 1);
        }
    }).on('error', err => {
        console.log('Error:', err.message);
        tryUrl(index + 1);
    });
}

tryUrl(0);
