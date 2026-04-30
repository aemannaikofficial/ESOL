import os
import re

html_files = ['index.html', 'about-us.html', 'how-youll-learn.html', 'contact-us.html', 'pricing.html', 'scqf.html']

for filename in html_files:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix GTranslate flags location (replace whatever the flags path is with the full URL)
    content = re.sub(
        r'"flags_location":"[^"]+wp-content[^"]+gtranslate[^"]+flags[^"]+"',
        r'"flags_location":"https://esol.education/wp-content/plugins/gtranslate/flags/"',
        content
    )
    
    # 2. Fix FontAwesome and Elementor icons to use full absolute URLs if not already,
    # or just use CDN for font awesome to avoid CORS issues
    content = content.replace(
        'https://esol.education/wp-content/plugins/elementor/assets/lib/font-awesome/css/fontawesome.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/fontawesome.min.css'
    )
    content = content.replace(
        'https://esol.education/wp-content/plugins/elementor/assets/lib/font-awesome/css/solid.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/solid.min.css'
    )
    content = content.replace(
        'https://esol.education/wp-content/plugins/elementor/assets/lib/font-awesome/css/regular.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/regular.min.css'
    )
    content = content.replace(
        'https://esol.education/wp-content/plugins/elementor/assets/lib/font-awesome/css/brands.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/brands.min.css'
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Icons and Flags location fixed.")
