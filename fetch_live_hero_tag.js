const https = require('https');

https.get('https://esol.education/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const regex = /<img[^>]*Reading-Poster[^>]*>/i;
        const match = data.match(regex);
        if (match) {
            console.log(match[0]);
        } else {
            console.log("No img tag found.");
        }
    });
}).on('error', err => console.log(err));
