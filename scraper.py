"""Read public dissertation defense listing and produce static JSON for GitHub Pages."""
import json, os, re, sys, time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup

ROOT='https://nubip.edu.ua/defend'
MONTHS={'січ':1,'лют':2,'бер':3,'кві':4,'трав':5,'чер':6,'лип':7,'сер':8,'вер':9,'жов':10,'лис':11,'гру':12}
DATE_RE=re.compile(r'(\d{1,2})\s+(січ\w*|лют\w*|бер\w*|кві\w*|трав\w*|чер\w*|лип\w*|сер\w*|вер\w*|жов\w*|лис\w*|гру\w*)\s+(20\d{2})(?:\s*[-–]\s*(\d{1,2}:\d{2}))?',re.I)
TITLE_RE=re.compile(r'^Захист\s+дисертації\s+(.+?)\s+на\s+тему\s*:\s*[«\"](.+?)[»\"]',re.I|re.S)
BASE=Path(__file__).resolve().parent

def date_in(text):
 m=DATE_RE.search(text)
 if not m:return None
 mo=MONTHS.get(m.group(2).lower()[:3]);return (f'{int(m.group(3)):04d}-{mo:02d}-{int(m.group(1)):02d}',m.group(4) or '') if mo else None

def extract(html):
 soup=BeautifulSoup(html,'html.parser'); result={}
 for a in soup.select('a[href]'):
  title=a.get_text(' ',strip=True)
  if not re.match(r'^Захист\s+дисертації\b',title,re.I):continue
  url=urljoin(ROOT,a['href']).split('#')[0].split('?')[0]
  if urlparse(url).hostname not in ('nubip.edu.ua','www.nubip.edu.ua') or urlparse(url).path in ('/','/defend'):continue
  # Entries on the listing have a heading followed by date and place in the same list item/card.
  ancestors=[a,*list(a.parents)[:9]]
  candidates=[]
  for node in ancestors:
   if node.name in ('li','article','.views-row','div','section'):
    t=node.get_text(' ',strip=True)
    if len(t)<2600 and date_in(t):candidates.append(t)
  if not candidates:
   for node in ancestors:
    t=node.get_text(' ',strip=True)
    if len(t)<2600 and date_in(t):candidates.append(t)
  if not candidates:continue
  snippet=min(candidates,key=len)
  dt=date_in(snippet)
  if not dt:continue
  m=TITLE_RE.search(title)
  place=re.search(r'Місце\s+проведення\s*(.+?)(?=Захист\s+дисертації|$)',snippet,re.I)
  result[url]={'url':url,'title':title,'person':m.group(1).strip() if m else title.replace('Захист дисертації','',1).split(' на тему:')[0].strip(), 'topic':m.group(2).strip() if m else title,'date':dt[0],'time':dt[1],'place':place.group(1).strip()[:300] if place else ''}
 return list(result.values())

def main():
 s=requests.Session();s.headers.update({'User-Agent':'Mozilla/5.0 (compatible; PublicNUBiPDefenseCalendar/1.0)','Accept-Language':'uk-UA,uk;q=0.9'})
 path=BASE/'data.json'
 previous=json.loads(path.read_text(encoding='utf-8')) if path.exists() else {'items':[]}
 items={x['url']:x for x in previous.get('items',[])}
 seen=set();pages=0;old=0;complete=False
 for page in range(500):
  try:
   r=s.get(ROOT,params={'page':page},timeout=35);r.raise_for_status()
  except requests.RequestException as e:
   raise RuntimeError(f'Не вдалося завантажити сторінку {page}: {e}') from e
  records=extract(r.text)
  if not records:
   if page==0:raise RuntimeError('Перша сторінка не містить розпізнаних записів: перевірте HTML-парсер')
   # An empty page after data is a possible end; do not discard existing archive.
   complete=True;break
  urls={x['url'] for x in records}
  if urls.issubset(seen):complete=True;break
  seen.update(urls);pages+=1
  for x in records:
   if x['date']>='2026-01-01':items[x['url']]=x
  if all(x['date']<'2026-01-01' for x in records):old+=1
  else:old=0
  # 2 consecutive old pages only when descending pagination; future items cannot be behind them in normal chronological feed.
  if old>=2:complete=True;break
  time.sleep(0.4)
 if not complete:raise RuntimeError('Досягнуто ліміту сторінок; дані не перезаписано')
 output={'updated_at':datetime.now(timezone.utc).isoformat(timespec='seconds'),'pages_scanned':pages,'complete':True,'items':sorted(items.values(),key=lambda x:(x['date'],x['time'],x['url']))}
 path.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(f'OK: {len(output["items"])} records, {pages} pages')

if __name__=='__main__':main()
