"""Create auditable crop comparisons, not a pixel-fidelity score."""
from pathlib import Path
import argparse,json,hashlib
from PIL import Image,ImageOps,ImageDraw
parser=argparse.ArgumentParser();parser.add_argument('--stage',choices=['initial','final'],required=True);args=parser.parse_args()
root=Path(__file__).resolve().parents[1];base=root/'.impeccable/comic-build'
spec=json.loads((base/'spec.json').read_text());out=base/'comparisons'/args.stage;out.mkdir(parents=True,exist_ok=True)
captures=base/'captures/initial' if args.stage=='initial' else root/'.impeccable/review'
rows=[]
for scene in spec['scenes']:
 refp=Path(scene['reference']);buildp=captures/scene['capture'];ref=Image.open(refp).convert('RGB');build=Image.open(buildp).convert('RGB')
 for region in scene['regions']:
  canvas=Image.new('RGB',(1440,650),'#111315');draw=ImageDraw.Draw(canvas)
  for x,label,img,box in [(0,'APPROVED COMPOSITION',ref,region['referenceBox']),(720,'CURRENT BUILD / LATER APPROVED ART',build,region['buildBox'])]:
   crop=ImageOps.contain(img.crop(tuple(box)),(696,596))
   canvas.paste(crop,(x+12+(696-crop.width)//2,42+(596-crop.height)//2))
   draw.text((x+14,12),label,fill='white')
  dest=out/(scene['id']+'-'+region['id']+'.png');canvas.save(dest)
  rows.append({'scene':scene['id'],'region':region['id'],'reference':str(refp),'capture':str(buildp),'referenceBox':region['referenceBox'],'buildBox':region['buildBox'],'pair':str(dest),'referenceHash':hashlib.sha256(refp.read_bytes()).hexdigest(),'captureHash':hashlib.sha256(buildp.read_bytes()).hexdigest()})
(out/'report.json').write_text(json.dumps({'stage':args.stage,'method':spec['comparisonMethod'],'regions':rows},ensure_ascii=False,indent=2))
print(str(out/'report.json'))

