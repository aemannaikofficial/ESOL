const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const insert = `
    /* Mobile header: logo left, burger right */
    .elementor-element-ba0e72c.e-con {
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-wrap: nowrap !important;
        padding: 10px 20px !important;
    }
    .elementor-element-1320158 { display: none !important; }
    .elementor-element-924ad27 {
        display: flex !important;
        flex: 1 1 auto !important;
        align-items: center !important;
        justify-content: flex-start !important;
    }
    .elementor-element-425c400 {
        display: flex !important;
        flex: 0 0 auto !important;
        align-items: center !important;
        justify-content: flex-end !important;
    }

`;

// Find the ELEMENTOR MOBILE BURGER FIX comment (line 1145, 0-indexed line 1144)
const lines = css.split('\n');
// Insert before line index 1144
lines.splice(1144, 0, insert);
fs.writeFileSync('style.css', lines.join('\n'), 'utf8');
console.log('CSS inserted at line 1145');
