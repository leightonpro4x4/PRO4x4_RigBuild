from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import hashlib, json

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'references/y62-owner/IMG_4540.jpeg'
OUT = ROOT / 'assets/y62-canonical-candidates/Y62-R34-V1-owner-source-v01.jpg'
W,H = 1672,615
BG=(24,28,26)
FG=(223,226,222)
MUTED=(166,173,168)
LINE=(82,94,86)

def font(size):
    candidates=[
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'
    ]
    for p in candidates:
        if Path(p).exists(): return ImageFont.truetype(p,size=size)
    return ImageFont.load_default()

src=Image.open(SRC).convert('RGB')
# Preserve the complete owner photo and camera geometry: uniform scale only, no crop/warp.
photo_w,photo_h=700,525
photo=src.resize((photo_w,photo_h),Image.Resampling.LANCZOS)
canvas=Image.new('RGB',(W,H),BG)
d=ImageDraw.Draw(canvas)
d.rectangle((16,16,W-17,H-17),outline=LINE,width=1)
d.rectangle((32,33,W-33,H-33),outline=LINE,width=1)
x=(W-photo_w)//2
y=45
canvas.paste(photo,(x,y))
d.text((32,19),'Y62-R34-V1 · OWNER-SOURCE GEOMETRY CANDIDATE v0.1',fill=FG,font=font(11))
d.text((32,H-42),'REFERENCE-BACKED · REVIEW MASTER ONLY · no perspective warp / no synthetic geometry / no production promotion',fill=MUTED,font=font(10))
d.text((W-32,19),'PRIMARY: OWNER-Y62-REAR34-01 / IMG_4540.jpeg',fill=MUTED,font=font(10),anchor='ra')
d.text((W-32,H-42),'SOURCE PIXELS: owner-supplied raw photo · uniform scale only',fill=MUTED,font=font(10),anchor='ra')
OUT.parent.mkdir(parents=True,exist_ok=True)
canvas.save(OUT,'JPEG',quality=94,subsampling=0,optimize=False,progressive=False)
print(OUT)
print(hashlib.sha256(OUT.read_bytes()).hexdigest())
