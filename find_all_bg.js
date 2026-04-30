const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\60dd9081-c442-46ee-b7a2-be119934c467\\.system_generated\\steps\\744\\content.md', 'utf8');
const regex = /background-image:[^;]*url\([^)]+\)/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log(match[0]);
}
