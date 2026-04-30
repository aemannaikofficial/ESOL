const https = require('https');
const fs = require('fs');

const url = 'https://esol.education/about-us/';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        // Find all elementor post CSS files
        const cssFiles = data.match(/https:\/\/esol\.education\/wp-content\/uploads\/elementor\/css\/post-\d+\.css/g);
        if (cssFiles) {
            cssFiles.forEach(cssUrl => {
                https.get(cssUrl, (cssRes) => {
                    let cssData = '';
                    cssRes.on('data', (chunk) => { cssData += chunk; });
                    cssRes.on('end', () => {
                        // Check if it contains the IDs we are looking for
                        if (cssData.includes('83670a7') || cssData.includes('5bf5f8b')) {
                            console.log('Found CSS for About Us hero in:', cssUrl);
                            // Extract the background image URL
                            const bgMatch = cssData.match(/\.elementor-element-(?:83670a7|5bf5f8b)\{[^}]*background-image:url\("([^"]+)"\)/);
                            if (bgMatch) {
                                console.log('Background Image URL:', bgMatch[1]);
                            } else {
                                // Try without quotes
                                const bgMatch2 = cssData.match(/\.elementor-element-(?:83670a7|5bf5f8b)\{[^}]*background-image:url\(([^)]+)\)/);
                                if (bgMatch2) {
                                    console.log('Background Image URL:', bgMatch2[1]);
                                }
                            }
                        }
                    });
                });
            });
        }
    });
});
