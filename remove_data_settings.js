const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname);
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const strToReplace = ` data-settings='{"shape_divider_top":"drops"}'`;
    
    if (content.includes(strToReplace)) {
        content = content.replace(new RegExp(strToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed data-settings from ${file}`);
    }
});
