import os
from bs4 import BeautifulSoup
import re

url_map = {
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
    'https://esol.education/': 'index.html',
    'http://esol.education/': 'index.html',
    'https://esol.education': 'index.html',
    'http://esol.education': 'index.html',
}

html_files = ['index.html', 'about-us.html', 'how-youll-learn.html', 'contact-us.html', 'pricing.html', 'scqf.html']

for filename in html_files:
    if not os.path.exists(filename):
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Process only <a> tags
    for a in soup.find_all('a', href=True):
        href = a['href']
        
        # Check against url_map
        for live_url, local_url in url_map.items():
            if href == live_url:
                a['href'] = local_url
                break
            elif href.startswith(live_url + '#'):
                # Handle anchor links
                a['href'] = local_url + href[len(live_url):]
                break

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(str(soup))

print("Links localized successfully using BeautifulSoup.")
