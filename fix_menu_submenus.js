const fs = require('fs');

// 1. Fix style.css
let css = fs.readFileSync('style.css', 'utf8');

// Find the section for .elementor-nav-menu--dropdown .sub-menu
const subMenuRegex = /\.elementor-nav-menu--dropdown\s+\.sub-menu\s*\{[^}]+\}/g;
const newSubMenuCss = `.elementor-nav-menu--dropdown .sub-menu {
        display: none !important;
        padding-left: 16px !important;
        list-style: none !important;
        margin-top: 5px !important;
        background: rgba(10, 10, 157, 0.03) !important;
        border-radius: 8px !important;
    }`;

css = css.replace(subMenuRegex, newSubMenuCss);

// Add the submenu-open logic
if (!css.includes('.submenu-open')) {
    css += `
    /* Show when parent menu item has .submenu-open class */
    .elementor-nav-menu--dropdown .menu-item.submenu-open > .sub-menu {
        display: block !important;
    }

    /* Arrow indicator for items with submenus */
    .elementor-nav-menu--dropdown .menu-item-has-children > a {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
    }

    .elementor-nav-menu--dropdown .menu-item-has-children > a::after {
        content: '+';
        font-family: monospace;
        font-size: 20px;
        margin-left: 10px;
        transition: transform 0.3s;
    }

    .elementor-nav-menu--dropdown .menu-item-has-children.submenu-open > a::after {
        content: '-';
    }
`;
}

fs.writeFileSync('style.css', css, 'utf8');
console.log('Fixed style.css');

// 2. Fix script.js
let js = fs.readFileSync('script.js', 'utf8');
if (!js.includes('submenu-open')) {
    const hook = "link.addEventListener('click', () => closeMenu(menuToggle, mobileDropdown));";
    const injection = `
            // Handle submenu toggling in mobile nav
            if (link.parentElement.classList.contains('menu-item-has-children')) {
                link.addEventListener('click', (e) => {
                    // If sub-menu is closed, open it and don't navigate
                    if (!link.parentElement.classList.contains('submenu-open')) {
                        e.preventDefault();
                        e.stopPropagation();
                        link.parentElement.classList.add('submenu-open');
                    }
                });
            } else {
                ${hook}
            }
    `;
    
    // We need to replace the loop part
    const loopPart = /mobileDropdown\.querySelectorAll\('a'\)\.forEach\(link => \{[\s\S]+?\}\);/;
    const newLoopPart = `mobileDropdown.querySelectorAll('a').forEach(link => {
            if (link.parentElement.classList.contains('menu-item-has-children')) {
                link.addEventListener('click', (e) => {
                    if (!link.parentElement.classList.contains('submenu-open')) {
                        e.preventDefault();
                        e.stopPropagation();
                        // Close other submenus
                        mobileDropdown.querySelectorAll('.submenu-open').forEach(el => {
                            if (el !== link.parentElement) el.classList.remove('submenu-open');
                        });
                        link.parentElement.classList.add('submenu-open');
                    }
                });
            } else {
                link.addEventListener('click', () => closeMenu(menuToggle, mobileDropdown));
            }
        });`;
    
    js = js.replace(loopPart, newLoopPart);
    fs.writeFileSync('script.js', js, 'utf8');
    console.log('Fixed script.js');
}
