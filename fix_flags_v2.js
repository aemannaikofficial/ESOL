const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about-us.html', 'pricing.html', 'contact-us.html', 'how-youll-learn.html', 'scqf.html', 'a2.html', 'b1.html', 'b2.html', 'c1.html', 'c2.html'];

const flagUrl = 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/24px-Flag_of_the_United_Kingdom.svg.png';

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove flag from "English levels" heading
    // Find <h2 ...><img ...>English levels</h2>
    const headingFlagRegex = /(<h2[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>)<img[^>]+>(English levels<\/h2>)/gi;
    content = content.replace(headingFlagRegex, '$1$2');

    // 2. Fix/Add flag to the top bar language indicator
    // Look for the static indicator I added or the gtranslate wrapper
    const staticGTransRegex = /<div style="display:flex;align-items:center;gap:8px;padding:5px;font-family:sans-serif;color:#fff;">[\s\S]+?<\/div>/;
    const staticGTransHeader = `
    <div style="display:flex;align-items:center;gap:8px;padding:5px;font-family:sans-serif;color:#fff;font-weight:600;">
        <img src="${flagUrl}" width="20" height="12" style="border: 1px solid rgba(255,255,255,0.2);">
        <span>English</span>
        <i class="fas fa-caret-down" style="font-size: 10px; margin-left: -2px;"></i>
    </div>`;

    if (content.includes('gt-wrapper')) {
        // If it still has the gtranslate wrapper, replace it
        const gtransRegex = /<div class="gtranslate_wrapper" id="gt-wrapper-\d+"><\/div>/;
        content = content.replace(gtransRegex, staticGTransHeader);
    } else {
        // If it already has my static one, replace it with the updated one
        content = content.replace(staticGTransRegex, staticGTransHeader);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
});
