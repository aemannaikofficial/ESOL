const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about-us.html', 'pricing.html', 'contact-us.html', 'how-youll-learn.html', 'scqf.html', 'a2.html', 'b1.html', 'b2.html', 'c1.html', 'c2.html'];

// Using a very reliable flag CDN
const flagUrl = 'https://flagcdn.com/w20/gb.png';

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Look for the static indicator I added
    // Match the div with white color
    const staticGTransRegex = /<div style="display:flex;align-items:center;gap:8px;padding:5px;font-family:sans-serif;color:#fff;[^"]*">[\s\S]+?<\/div>/;
    const staticGTransRegex2 = /<div style="display:flex;align-items:center;gap:8px;padding:5px;font-family:sans-serif;color:#fff;">[\s\S]+?<\/div>/;
    
    // Updated header with DARK blue color for visibility
    const staticGTransHeader = `<div style="display:flex;align-items:center;gap:6px;padding:5px;font-family:'Quicksand',sans-serif;color:#0A0A9D;font-weight:700;font-size:14px;">
    <img src="${flagUrl}" width="18" style="border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <span>English</span>
    <i class="fas fa-caret-down" style="font-size: 10px;"></i>
</div>`;

    if (staticGTransRegex.test(content)) {
        content = content.replace(staticGTransRegex, staticGTransHeader);
    } else if (staticGTransRegex2.test(content)) {
        content = content.replace(staticGTransRegex2, staticGTransHeader);
    } else if (content.includes('gt-wrapper')) {
        const gtransRegex = /<div class="gtranslate_wrapper" id="gt-wrapper-\d+"><\/div>/;
        content = content.replace(gtransRegex, staticGTransHeader);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed visibility for:', file);
});
