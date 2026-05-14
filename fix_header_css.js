const fs = require('fs');

const headerFixCss = `
/* ==================================================
   HEADER FIXES (Replaces missing Elementor CSS)
   ================================================== */
.elementor-element-3d4dccb {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    padding: 0 20px !important;
    box-sizing: border-box !important;
    flex-wrap: nowrap !important;
}

.elementor-element-924ad27 {
    width: auto !important;
    max-width: 250px !important;
    display: flex !important;
    align-items: center !important;
    flex: 0 0 auto !important;
}

.elementor-element-425c400 {
    width: auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    flex: 1 1 auto !important;
}

/* Mobile responsive fixes */
@media (max-width: 768px) {
    .elementor-element-3d4dccb {
        flex-wrap: nowrap !important;
        padding: 0 10px !important;
    }
}
`;

fs.appendFileSync('style.css', '\n' + headerFixCss);
console.log('Header CSS appended successfully.');
