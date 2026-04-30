import os
import re

# Mapping of live URLs to local filenames
url_map = {
    'https://esol.education/': 'index.html',
    'http://esol.education/': 'index.html',
    'https://esol.education': 'index.html',
    'http://esol.education': 'index.html',
    'https://esol.education/about-us/': 'about-us.html',
    'http://esol.education/about-us/': 'about-us.html',
    'https://esol.education/how-youll-learn/': 'how-youll-learn.html',
    'http://esol.education/how-youll-learn/': 'how-youll-learn.html',
    'https://esol.education/contact-us-2/': 'contact-us.html',
    'http://esol.education/contact-us-2/': 'contact-us.html',
    'https://esol.education/contact-us/': 'contact-us.html',
    'http://esol.education/contact-us/': 'contact-us.html',
    'https://esol.education/pricing/': 'pricing.html',
    'http://esol.education/pricing/': 'pricing.html',
    'https://esol.education/a1-english-level/': 'scqf.html',
    'http://esol.education/a1-english-level/': 'scqf.html',
}

html_files = ['index.html', 'about-us.html', 'how-youll-learn.html', 'contact-us.html', 'pricing.html', 'scqf.html']

for filename in html_files:
    if not os.path.exists(filename):
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the URLs
    for url, local in url_map.items():
        # Using regex to catch variants with/without trailing slashes or different quotes
        # Replacing href="url" or href='url'
        pattern = re.compile(re.escape(url), re.IGNORECASE)
        content = pattern.sub(local, content)
    
    # Also handle anchor links like /how-youll-learn/#courses
    content = content.replace('how-youll-learn.html#', 'how-youll-learn.html#') # Already handled by map but just in case
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Links localized successfully.")
