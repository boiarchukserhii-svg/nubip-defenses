"""Collect public NUBiP dissertation defenses and enrich entries with verified detail metadata."""
import json, re, time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup
from names import person_nominative

ROOT = 'https://nubip.edu.ua/defend'
BASE = Path(__file__).resolve().parent
MONTHS = {'січ':1,'лют':2,'бер':3,'кві':4,'трав':5,'чер':6,'лип':7,'сер':8,'вер':9,'жов':10,'лис':11,'гру':12}
DATE_RE = re.compile(r'(\d{1,2})\s+(січ\w*|лют\w*|бер\w*|кві\w*|трав\w*|чер\w*|лип\w*|сер\w*|вер\w*|жов\w*|лис\w*|гру\w*)\s+(20\d{2})(?:\s*[-–]\s*(\d{1,2}:\d{2}))?', re.I)
TITLE_RE = re.compile(r'^Захист\s+дисертації\s+(.+?)\s+на\s+тему\s*:\s*«(.*)»\s*$', re.I | re.S)


def date_in(text):
    m = DATE_RE.search(text)
    if not m: return None
    month = MONTHS.get(m.group(2).lower()[:3])
    if not month: return None
    return f'{int(m.group(3)):04d}-{month:02d}-{int(m.group(1)):02d}', m.group(4) or ''


def listing(html):
    soup = BeautifulSoup(html, 'html.parser')
    records = {}
    for a in soup.select('a[href]'):
        title = a.get_text(' ', strip=True)
        if not title.lower().startswith('захист дисертації '): continue
        url = urljoin(ROOT, a['href']).split('#')[0].split('?')[0]
        if urlparse(url).hostname not in ('nubip.edu.ua', 'www.nubip.edu.ua') or urlparse(url).path in ('/', '/defend'): continue
        ancestors = [a, *list(a.parents)[:9]]
        candidates = [node.get_text(' ', strip=True) for node in ancestors if len(node.get_text(' ', strip=True)) < 2600 and date_in(node.get_text(' ', strip=True))]
        if not candidates: continue
        snippet = min(candidates, key=len)
        dt = date_in(snippet)
        if not dt: continue
        m = TITLE_RE.match(title)
        place = re.search(r'Місце\s+проведення\s*(.+?)(?=Захист\s+дисертації|$)', snippet, re.I)
        records[url] = {'url':url, 'title':title, 'person':m.group(1).strip() if m else title.replace('Захист дисертації ', '', 1).split(' на тему:')[0].strip(), 'topic':m.group(2).strip() if m else title, 'date':dt[0], 'time':dt[1], 'place':place.group(1).strip()[:300] if place else ''}
    return list(records.values())


def enrich(session, item):
    response = session.get(item['url'], timeout=35)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    text = soup.get_text(' ', strip=True)
    degree = ''
    if re.search(r'на\s+здобуття\s+(?:наукового\s+)?ступеня\s+доктора\s+філософії', text, re.I): degree = 'PhD'
    elif re.search(r'на\s+здобуття\s+(?:наукового\s+)?ступеня\s+доктора\s+наук', text, re.I): degree = 'Доктор наук'
    council = re.search(r'(?:разової\s+спеціалізованої\s+вченої\s+ради\s+|спеціалізованої\s+вченої\s+ради\s+)([А-ЯІЇЄҐA-Z]{0,8}\s*[А-ЯІЇЄҐA-Z0-9.\-]{2,20})', text, re.I)
    specialty = re.search(r'(?:зі|за)\s+спеціальност[іи]\s+([A-ZА-ЯІЇЄҐ]?\d{2,3})\s*[«"]([^»"]+)', text, re.I)
    supervisor = re.search(r'Науков(?:ий|а)\s+керівник\s*[–—:-]\s*(.+?)(?=Голова\s+ради|Рецензент|Офіційний\s+опонент|Дисертація|$)', text, re.I)
    item['degree'] = degree
    item['council'] = council.group(1).strip() if council else ''
    item['specialty'] = (specialty.group(1)+' '+specialty.group(2)).strip() if specialty else ''
    item['supervisor'] = supervisor.group(1).strip()[:350] if supervisor else ''
    item['details_checked'] = True
    return item


def main():
    session = requests.Session()
    session.headers.update({'User-Agent':'Mozilla/5.0 (compatible; PublicNUBiPDefenseCalendar/2.0)', 'Accept-Language':'uk-UA,uk;q=0.9'})
    path = BASE / 'data.json'
    previous = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {'items':[]}
    items = {x['url']:x for x in previous.get('items', [])}
    seen = set()
    scanned = 0
    old_pages = 0
    complete = False
    for page in range(500):
        response = session.get(ROOT, params={'page':page}, timeout=35)
        response.raise_for_status()
        records = listing(response.text)
        if not records:
            if page == 0: raise RuntimeError('Перша сторінка не містить записів')
            complete = True
            break
        urls = {x['url'] for x in records}
        if urls.issubset(seen):
            complete = True
            break
        seen.update(urls)
        scanned += 1
        for record in records:
            if record['date'] >= '2026-01-01':
                items[record['url']] = {**items.get(record['url'], {}), **record}
        old_pages = old_pages+1 if all(x['date']<'2026-01-01' for x in records) else 0
        if old_pages >= 2:
            complete = True
            break
        time.sleep(.2)
    if not complete: raise RuntimeError('Перевищено ліміт сторінок')
    # Preserve source form and calculate a separate display form on every refresh.
    for item in items.values():
        original = item.get('person_original') or item.get('person', '')
        item['person_original'] = original
        item['person_display'], item['name_status'] = person_nominative(original)
    failures = 0
    for item in items.values():
        if item.get('details_checked'): continue
        try:
            enrich(session, item)
        except requests.RequestException as exc:
            failures += 1
            print('Не вдалося перевірити деталі:', item['url'], exc)
        time.sleep(.1)
    output = {'updated_at':datetime.now(timezone.utc).isoformat(timespec='seconds'), 'pages_scanned':scanned, 'complete':True, 'detail_failures':failures, 'items':sorted(items.values(), key=lambda x:(x['date'],x.get('time',''),x['url']))}
    path.write_text(json.dumps(output, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(f'OK: {len(items)} захистів, {scanned} сторінок, {failures} помилок деталей')

if __name__ == '__main__': main()
