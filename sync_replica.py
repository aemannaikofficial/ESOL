import os
import urllib.request
from bs4 import BeautifulSoup

urls = {
    'index.html': 'https://esol.education/',
    'about-us.html': 'https://esol.education/about-us/',
    'how-youll-learn.html': 'https://esol.education/how-youll-learn/',
    'contact-us.html': 'https://esol.education/contact-us-2/',
    'pricing.html': 'https://esol.education/pricing/',
    'scqf.html': 'https://esol.education/a1-english-level/'
}

# The URL map for localization
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

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

for filename, url in urls.items():
    print(f"Downloading {url} to {filename}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8')
            
        # Parse HTML
        soup = BeautifulSoup(html, 'html.parser')
        
        # Modify links
        for a in soup.find_all('a', href=True):
            href = a['href']
            for live_url, local_url in url_map.items():
                if href == live_url:
                    a['href'] = local_url
                    break
                elif href.startswith(live_url + '#'):
                    a['href'] = local_url + href[len(live_url):]
                    break
                    
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(str(soup))
            
        print(f"Successfully downloaded and localized {filename}.")
        
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("All done.")
