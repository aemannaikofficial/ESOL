const https = require('https');

https.get('https://esol.education/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const match = data.match(/Reading-Poster[^"]+/);
        if (match) {
            console.log("Found:", match[0]);
        } else {
            console.log("Not found.");
        }
    });
}).on('error', err => console.log(err));
