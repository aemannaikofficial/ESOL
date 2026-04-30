const fs = require('fs');

const files = ['a2.html', 'b1.html', 'b2.html', 'c1.html', 'c2.html'];

// Sidebar link replacements for all level pages
const sidebarReplacements = [
    ['href="https://esol.education/a1-english-level/"', 'href="scqf.html"'],
    ['href="https://esol.education/a2-english-level/"', 'href="a2.html"'],
    ['href="https://esol.education/b1-english-level/"', 'href="b1.html"'],
    ['href="https://esol.education/b2-english-level/"', 'href="b2.html"'],
    ['href="https://esol.education/c1-english-level/"', 'href="c1.html"'],
    ['href="https://esol.education/c2-proficient/"', 'href="c2.html"'],
];

// Main nav link replacements
const navReplacements = [
    ['href="https://esol.education/"', 'href="index.html"'],
    ['href="https://esol.education/how-youll-learn/"', 'href="how-youll-learn.html"'],
    ['href="https://esol.education/about/"', 'href="about-us.html"'],
    ['href="https://esol.education/about-us/"', 'href="about-us.html"'],
    ['href="https://esol.education/pricing/"', 'href="pricing.html"'],
    ['href="https://esol.education/contact/"', 'href="contact-us.html"'],
    ['href="https://esol.education/contact-us/"', 'href="contact-us.html"'],
];

// CSS/JS to inject
const cssInject = '<link rel="stylesheet" href="style.css"/>';
const jsInject = '<script src="script.js" defer></script>';

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Apply sidebar replacements
    [...sidebarReplacements, ...navReplacements].forEach(([from, to]) => {
        content = content.split(from).join(to);
    });

    // Inject our custom CSS before </head>
    if (!content.includes('style.css')) {
        content = content.replace('</head>', `${cssInject}\n</head>`);
    }

    // Inject script before </body>
    if (!content.includes('script.js')) {
        content = content.replace('</body>', `${jsInject}\n</body>`);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
});

// Also update scqf.html sidebar links to point to local files
let scqf = fs.readFileSync('scqf.html', 'utf8');
[...sidebarReplacements, ...navReplacements].forEach(([from, to]) => {
    scqf = scqf.split(from).join(to);
});
fs.writeFileSync('scqf.html', scqf, 'utf8');
console.log('Updated: scqf.html sidebar links');
