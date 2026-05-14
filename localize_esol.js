const fs = require('fs');

// Read the freshly downloaded HTML
let content = fs.readFileSync('downloaded_esol.html', 'utf8');

// Replace absolute URLs with local relative paths for assets
content = content.replace(/https?:\/\/esol\.education\/wp-content\//g, 'wp-content/');
content = content.replace(/https?:\/\/esol\.education\/wp-includes\//g, 'wp-includes/');

// Replace links to internal pages
// Matches: https://esol.education/page-name/ or http://esol.education/page-name/
content = content.replace(/https?:\/\/esol\.education\/([a-zA-Z0-9-]+)\//g, '$1.html');

// Replace link to home page
content = content.replace(/href="https?:\/\/esol\.education\/"/g, 'href="index.html"');

// Replace link to home page with single quotes if any
content = content.replace(/href='https?:\/\/esol\.education\/'/g, "href='index.html'");

// The regex above will replace https://esol.education/how-youll-learn/#courses 
// with how-youll-learn.html#courses automatically because the / captures the page, 
// wait, the trailing slash is important. 
// https://esol.education/how-youll-learn/#courses -> $1 = how-youll-learn, the trailing slash is matched, so it becomes how-youll-learn.html#courses. Correct!

// Inject our custom CSS and JS
if (!content.includes('style.css')) {
    content = content.replace('</head>', '    <link rel="stylesheet" href="style.css" />\n</head>');
}
if (!content.includes('script.js')) {
    content = content.replace('</body>', '    <script src="script.js"></script>\n</body>');
}

// Write to index.html
fs.writeFileSync('index.html', content);

console.log('Successfully localized index.html completely!');
