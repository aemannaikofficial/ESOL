const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname);
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the elementor-shape-top div and everything inside it
    // We can use a regex that matches <div aria-hidden="true" class="elementor-shape elementor-shape-top"...</div>
    const regex = /<div aria-hidden="true" class="elementor-shape elementor-shape-top"[^>]*>[\s\S]*?<\/div>/gi;
    
    if (regex.test(content)) {
        content = content.replace(regex, '');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed shape divider from ${file}`);
    } else {
        console.log(`No shape divider found in ${file}`);
    }
});
