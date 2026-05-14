const fs = require('fs');

// Read index.html
let content = fs.readFileSync('index.html', 'utf8');

// Remove ?ver=XXXX version query strings from local wp-content / wp-includes asset links
// These cause the browser to look for a file with ? in the name which doesn't exist locally
content = content.replace(/((?:wp-content|wp-includes)\/[^"'?]+\.(css|js))\?[^"']*/g, '$1');

fs.writeFileSync('index.html', content);
console.log('Stripped version query strings from local asset paths in index.html');
