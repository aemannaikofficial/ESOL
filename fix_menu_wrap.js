const fs = require('fs');
const css = `
/* Ensure menu items do not wrap to the next line */
ul.elementor-nav-menu {
    display: flex !important;
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
}

ul.elementor-nav-menu > li {
    display: inline-block !important;
}

/* Ensure the parent nav containers have enough space */
.elementor-nav-menu--main {
    width: auto !important;
    max-width: none !important;
}
`;
fs.appendFileSync('style.css', '\n' + css);
console.log('Appended menu wrap fix CSS.');
