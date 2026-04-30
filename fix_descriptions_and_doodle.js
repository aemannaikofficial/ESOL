const fs = require('fs');
const path = require('path');

const files = ['scqf.html', 'a2.html', 'b1.html', 'b2.html', 'c1.html', 'c2.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Show level descriptions on mobile/tablet
    // Remove elementor-hidden-tablet and elementor-hidden-mobile from sections
    content = content.replace(/elementor-hidden-tablet/g, '');
    content = content.replace(/elementor-hidden-mobile/g, '');

    // 2. Remove "drops" shape divider (the doodle at the top)
    // Find <div class="elementor-shape elementor-shape-top" ...> ... </div>
    const shapeRegex = /<div class="elementor-shape elementor-shape-top"[\s\S]+?<\/div>/g;
    content = content.replace(shapeRegex, '');
    
    // Also remove the data-settings that trigger it
    content = content.replace(/"shape_divider_top":"drops"/g, '"shape_divider_top":""');
    content = content.replace(/&quot;shape_divider_top&quot;:&quot;drops&quot;/g, '&quot;shape_divider_top&quot;:&quot;&quot;');

    // 3. Fix the "English levels" heading to include a flag icon if possible
    // <h2 class="elementor-heading-title elementor-size-medium">English levels</h2>
    const flagUrl = 'https://esol.education/wp-content/plugins/gtranslate/flags/24/en-uk.png';
    const headingRegex = /(<h2[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>)(English levels)(<\/h2>)/gi;
    content = content.replace(headingRegex, `$1<img src="${flagUrl}" style="width:24px;vertical-align:middle;margin-right:8px;">$2$3`);

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
});

// Also fix index.html for the flag in the header if it exists
let index = fs.readFileSync('index.html', 'utf8');
const gtransRegex = /<div class="gtranslate_wrapper" id="gt-wrapper-\d+"><\/div>/;
const staticGTrans = `<div style="display:flex;align-items:center;gap:8px;padding:5px;font-family:sans-serif;color:#fff;">
    <img src="https://esol.education/wp-content/plugins/gtranslate/flags/24/en-uk.png" width="24" height="24">
    <span>English</span>
    <i class="fas fa-caret-down"></i>
</div>`;
index = index.replace(gtransRegex, staticGTrans);
fs.writeFileSync('index.html', index, 'utf8');
console.log('Updated index.html with static language indicator');
