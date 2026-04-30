const https = require('https');
const fs = require('fs');

const pages = [
    { url: 'https://esol.education/a2-english-level/', file: 'a2.html' },
    { url: 'https://esol.education/b1-english-level/', file: 'b1.html' },
    { url: 'https://esol.education/b2-english-level/', file: 'b2.html' },
    { url: 'https://esol.education/c1-english-level/', file: 'c1.html' },
    { url: 'https://esol.education/c2-proficient/', file: 'c2.html' },
];

function fetchPage(index) {
    if (index >= pages.length) {
        console.log('All done!');
        return;
    }
    const { url, file } = pages[index];
    console.log('Fetching:', url);
    https.get(url, (res) => {
        console.log('Status:', res.statusCode, 'for', url);
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            fs.writeFileSync(file, data, 'utf8');
            console.log('Saved:', file, '- Length:', data.length);
            fetchPage(index + 1);
        });
    }).on('error', err => {
        console.log('Error:', err.message, 'for', url);
        fetchPage(index + 1);
    });
}

fetchPage(0);
