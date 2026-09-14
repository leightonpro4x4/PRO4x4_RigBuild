from PIL import Image, ImageDraw, ImageFont, ImageOps
from pathlib import Path
import hashlib, json
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'assets/y62-canonical-candidates/Y62-R34-V1-camera-semantic-review-pack-v01.png'
primary=ROOT/'references/y62-owner/IMG_4540.jpeg'
rear=ROOT/'references/y62-owner/IMG_4508.jpeg'
candidate=ROOT/'assets/y62-canonical-candidates/Y62-R34-V1-owner-source-v01.jpg'
W,H=1920,1080
bg=(20,25,24); panel=(29,35,33); line=(92,106,97); text=(235,238,234); muted=(176,185,178); accent=(206,181,120); warn=(220,173,110)
canvas=Image.new('RGB',(W,H),bg); d=ImageDraw.Draw(canvas)
try:
    f32=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',32)
    f23=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',23)
    f18=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
    f16=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16)
    f15=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
except:
    f32=f23=f18=f16=f15=None

def fit(img, box, crop=False):
    x,y,w,h=box
    if crop:
        im=ImageOps.fit(img,(w,h),method=Image.Resampling.LANCZOS,centering=(0.5,0.5))
    else:
        im=img.copy(); im.thumbnail((w,h),Image.Resampling.LANCZOS)
        base=Image.new('RGB',(w,h),(12,15,14)); base.paste(im,((w-im.width)//2,(h-im.height)//2)); im=base
    canvas.paste(im,(x,y))
    d.rectangle([x,y,x+w,y+h],outline=line,width=2)

def label(x,y,s,font=f18,fill=text): d.text((x,y),s,font=font,fill=fill)

def wrap(x,y,w,s,font=f16,fill=muted,leading=5):
    words=s.split(); lines=[]; cur=''
    for word in words:
        test=(cur+' '+word).strip()
        if d.textbbox((0,0),test,font=font)[2] <= w: cur=test
        else:
            if cur: lines.append(cur)
            cur=word
    if cur: lines.append(cur)
    yy=y
    for ln in lines:
        d.text((x,yy),ln,font=font,fill=fill); yy+= (d.textbbox((0,0),'Ag',font=font)[3]+leading)
    return yy

label(36,24,'Y62-R34-V1 · CAMERA + SEMANTIC REVIEW PACK 01',f32)
label(36,65,'Candidate 01 exact checksum · owner-supplied 2025 Series 5 Y62 Warrior evidence',f18,muted)
label(1510,30,'REVIEW ONLY',f23,accent)
label(1510,62,'NO PRODUCTION PROMOTION',f16,warn)

# source images
p=Image.open(primary).convert('RGB'); r=Image.open(rear).convert('RGB'); c=Image.open(candidate).convert('RGB')
fit(p,(36,115,880,430)); label(52,125,'PRIMARY · OWNER-Y62-REAR34-01 / IMG_4540.jpeg',f16)
fit(c,(946,115,938,430)); label(962,125,'CANDIDATE 01 · UNIFORM SCALE ONLY / NO WARP',f16)
fit(r,(36,590,520,420)); label(52,600,'SUPPORT · OWNER-Y62-REAR-01',f16)

# semantic crops from primary
# coords from 1536x1152 primary: tailgate/rear lamps around x520-1120 y360-750, wheel/arch x450-760 y570-1020
crop1=p.crop((500,320,1180,760)); fit(crop1,(586,590,475,200),crop=True); label(602,600,'TAIL-LAMP / TAILGATE / BUMPER ANCHORS',f15)
crop2=p.crop((390,520,820,1100)); fit(crop2,(586,810,475,200),crop=True); label(602,820,'REAR WHEEL / ARCH / WARRIOR STANCE',f15)

# checklist panel
x0,y0,w0,h0=1095,590,789,420
d.rounded_rectangle([x0,y0,x0+w0,y0+h0],radius=12,fill=panel,outline=line,width=2)
label(x0+22,y0+18,'REVIEW GATE',f23)
y=y0+60
items=[
 ('EVIDENCE-BACKED','Vehicle identity · MY25 Series 5 Y62 Warrior'),
 ('EVIDENCE-BACKED','Factory Warrior wheels/tyres + Premcar stance'),
 ('MANUAL SIGNOFF','Rear-three-quarter camera target / perspective'),
 ('MANUAL SIGNOFF','Rear-quarter silhouette / body proportions'),
 ('MANUAL SIGNOFF','Tail-lamp + tailgate anchor geometry'),
 ('MANUAL SIGNOFF','Rear bumper + tow-area anchor geometry'),
 ('HOLD','F34 family scale/stance alignment before production lock'),
 ('BLOCKED','Transparent clean reconstruction / production rights'),
]
for state,desc in items:
    fill=accent if state=='EVIDENCE-BACKED' else (warn if state in ('MANUAL SIGNOFF','HOLD') else muted)
    label(x0+22,y,state,f15,fill)
    y=wrap(x0+178,y,w0-202,desc,f15,text,3)+7
label(x0+22,y0+h0-112,'Observed camera caution:',f15,warn)
wrap(x0+22,y0+h0-88,w0-44,'The raw owner image is a close rear-quarter perspective: the near rear corner/wheel is visibly dominant. This is authentic source geometry, but it must be explicitly accepted as the canonical R34 camera rather than silently corrected or warped.',f15,muted,2)

# footer
label(36,1030,'POLICY: REFERENCE_BACKED_APPROVED_VISUALS_ONLY · external exact-vehicle imagery remains reference-only unless rights are separately recorded',f15,muted)
label(36,1052,'PASS authority remains with an identified reviewer. This pack cannot self-approve camera geometry, master status or production use.',f15,muted)

out.parent.mkdir(parents=True,exist_ok=True); canvas.save(out,optimize=True)
print(out)
print(hashlib.sha256(out.read_bytes()).hexdigest())
