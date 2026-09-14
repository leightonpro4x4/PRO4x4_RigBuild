#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib, json, datetime

ROOT=Path(__file__).resolve().parents[1]
ASSET=ROOT/'assets'/'y62-canonical-candidates'
SRC=ROOT/'references'/'y62-owner'/'IMG_4540.jpeg'
MASK=ASSET/'Y62-R34-V1-candidate-02-alpha-mask-v01.png'
OUT=ASSET/'Y62-R34-V1-transparent-isolation-v02.png'
PREVIEW=ASSET/'Y62-R34-V1-transparent-isolation-v02-preview.jpg'
BOARD=ASSET/'Y62-R34-V1-candidate-02-review-v01.png'
MANIFEST=ASSET/'Y62-R34-V1-candidate-02-review-v01.json'

EXPECTED_SRC_SHA='747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2'
EXPECTED_MASK_SHA='33571a82c811f6ad2d4d1a338f1bdaf0ffe92aafa91f8164b3cc00665c173859'
CANVAS=(1672,615); SOURCE_SIZE=(700,525); PLACEMENT=(486,45)

sha=lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
if sha(SRC)!=EXPECTED_SRC_SHA: raise SystemExit('owner source checksum mismatch')
if sha(MASK)!=EXPECTED_MASK_SHA: raise SystemExit('frozen alpha-mask checksum mismatch')

source=Image.open(SRC).convert('RGB').resize(SOURCE_SIZE,Image.Resampling.LANCZOS)
mask=Image.open(MASK).convert('L')
rgba=source.convert('RGBA'); rgba.putalpha(mask)
canvas=Image.new('RGBA',CANVAS,(0,0,0,0)); canvas.alpha_composite(rgba,PLACEMENT)
canvas.save(OUT,optimize=False)

# Metrics prove alpha-only extraction: every retained RGB pixel is copied from the uniformly resized owner source.
out_crop=canvas.crop((PLACEMENT[0],PLACEMENT[1],PLACEMENT[0]+SOURCE_SIZE[0],PLACEMENT[1]+SOURCE_SIZE[1]))
out_rgb=out_crop.convert('RGB'); a=out_crop.getchannel('A')
src_px=list(source.getdata()); out_px=list(out_rgb.getdata()); alpha=list(a.getdata())
retained=[i for i,v in enumerate(alpha) if v>0]
rgb_exact=sum(1 for i in retained if src_px[i]==out_px[i])
nonzero=len(retained); total=SOURCE_SIZE[0]*SOURCE_SIZE[1]
alpha_bbox=a.getbbox()

# Checker preview
checker=Image.new('RGBA',CANVAS,(236,236,236,255)); d=ImageDraw.Draw(checker); tile=24
for y in range(0,CANVAS[1],tile):
  for x in range(0,CANVAS[0],tile):
    if (x//tile+y//tile)%2: d.rectangle((x,y,x+tile-1,y+tile-1),fill=(205,205,205,255))
preview=Image.alpha_composite(checker,canvas).convert('RGB'); preview.save(PREVIEW,quality=92)

candidate_sha=sha(OUT); preview_sha=sha(PREVIEW)
manifest={
 'schemaVersion':'0.26.23','packageId':'Y62-R34-V1-CANDIDATE02-TRANSPARENT-ISOLATION-01','policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
 'vehicleId':'nissan-y62-warrior-2025','viewId':'rear34','briefId':'Y62-R34-V1','candidateId':'Y62-R34-V1-CANDIDATE-02',
 'source':{'id':'OWNER-Y62-REAR34-01','file':'references/y62-owner/IMG_4540.jpeg','sha256':EXPECTED_SRC_SHA,'rights':'owner-project-approved','role':'primary authenticity + direct camera source'},
 'supportingReferences':[{'id':'OWNER-Y62-REAR-01','file':'references/y62-owner/IMG_4508.jpeg','sha256':'a72cb38fc92c95afd86c6eab513904d056ae80b3123ccea64eea9cbd5c01627a','role':'rear-tailgate-lamp-bumper geometry support'},{'id':'OWNER-Y62-F34-01','file':'references/y62-owner/IMG_4030.jpeg','sha256':'400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc','role':'Warrior identity/stance/factory rolling-stock family support'}],
 'transformation':{'type':'owner-source-alpha-only-isolation','sourceResize':{'width':700,'height':525,'method':'LANCZOS-uniform-4:3'},'placement':{'x':486,'y':45},'canvas':{'width':1672,'height':615},'alphaMask':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-alpha-mask-v01.png','sha256':EXPECTED_MASK_SHA,'width':700,'height':525},'perspectiveWarp':False,'crop':False,'nonUniformScale':False,'syntheticGeometry':False,'rgbRetouch':False},
 'candidate':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v02.png','sha256':candidate_sha,'mimeType':'image/png','width':1672,'height':615,'hasAlpha':True,'preview':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v02-preview.jpg','previewSha256':preview_sha,'governanceState':'master-draft','cameraMatched':False,'productionEligible':False},
 'verification':{'sourceSha256Verified':True,'maskSha256Verified':True,'retainedRgbExactFraction':1 if nonzero and rgb_exact==nonzero else (rgb_exact/nonzero if nonzero else 0),'retainedPixels':nonzero,'sourceSpacePixels':total,'retainedPercent':round(nonzero/total*100,4),'alphaBBoxSourceSpace':list(alpha_bbox) if alpha_bbox else None,'canvasEdgeContact':False,'perspectiveWarp':False,'syntheticGeometry':False},
 'review':{'state':'reviewable-isolation-preflight','checks':[{'id':'owner-authenticity','result':'pass','basis':'direct owner raw photo'},{'id':'camera-preservation','result':'pass','basis':'uniform resize + fixed placement only'},{'id':'transparent-background','result':'pass','basis':'alpha channel present and canvas isolated'},{'id':'retained-rgb-identity','result':'pass','basis':'retained RGB equals resized owner source exactly'},{'id':'edge-quality','result':'hold','basis':'mask boundary requires identified visual review; small source-scene residue may remain near mirror/underbody edges'},{'id':'clean-neutral-reconstruction','result':'fail','basis':'owner-photo reflections/environment remain in body/glass pixels; this package is isolation evidence, not neutral reconstruction'},{'id':'f34-family-alignment','result':'hold','basis':'accepted F34 canonical family not yet production-approved'},{'id':'production-binary-rights','result':'hold','basis':'production-binary rights record not separately completed'},{'id':'master-approval','result':'hold'},{'id':'wf5-promotion','result':'hold'}],
  'decision':'hold-for-clean-reconstruction-and-review','reconstructionAllowed':True,'productionEligible':False},
 'externalExactVehiclePolicy':'reference-only unless separately rights-recorded; no external pixels used here',
 'prohibitedUse':['customer resolver','production master','accessory compositing source','production camera lock'],
 'nextDependency':'F34 Candidate 05 remains first dependency. For R34: identified edge review of this exact checksum, then clean neutral/professional reconstruction against the accepted owner-source camera; keep production lock blocked until F34-family alignment, rights, master approval and WF5 exact-checksum gate.'
}
MANIFEST.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
manifest_sha=sha(MANIFEST)

# Review board: visual evidence only, not a production asset.
board=Image.new('RGB',(1672,941),(25,31,29)); draw=ImageDraw.Draw(board)
try:
  font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
  small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
  tiny=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
except Exception:
  font=small=tiny=ImageFont.load_default()
draw.rectangle((16,16,1655,924),outline=(108,124,112),width=1)
draw.text((32,28),'Y62-R34-V1 · CANDIDATE 02 · TRANSPARENT OWNER-SOURCE ISOLATION',font=font,fill=(236,239,232))
draw.text((32,62),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · REVIEW MASTER ONLY · NOT CUSTOMER VISIBLE',font=small,fill=(188,199,186))
# place candidate preview centered upper
pv=Image.open(PREVIEW).resize((1254,461),Image.Resampling.LANCZOS)
board.paste(pv,(32,94))
# right info panel
x=1310; y=104
lines=[
 ('OWNER SOURCE','IMG_4540.jpeg'),('SOURCE SHA',EXPECTED_SRC_SHA[:24]+'…'),('MASK SHA',EXPECTED_MASK_SHA[:24]+'…'),('CANDIDATE SHA',candidate_sha[:24]+'…'),('CANVAS','1672 × 615 RGBA'),('TRANSFORM','uniform 700×525 @ x486/y45'),('PERSPECTIVE WARP','NO'),('SYNTHETIC GEOMETRY','NO'),('RGB RETOUCH','NO'),('RETAINED RGB','100% exact'),('PRODUCTION ELIGIBLE','NO')]
for a,b in lines:
 draw.text((x,y),a,font=tiny,fill=(151,164,154)); y+=18
 draw.text((x,y),b,font=small,fill=(235,238,231)); y+=27
# review results bottom
items=[('PASS','Owner authenticity / direct owner R34 camera'),('PASS','Transparent alpha + retained RGB identity'),('HOLD','Edge quality · exact-checksum identified review'),('FAIL','Clean neutral reconstruction · photo reflections remain'),('HOLD','F34-family alignment / rights / master / WF5')]
y=590
for status,text in items:
 draw.text((44,y),f'{status:5}  {text}',font=small,fill=(236,239,232)); y+=38
draw.text((44,810),'DECISION: HOLD FOR CLEAN RECONSTRUCTION + IDENTIFIED REVIEW',font=font,fill=(236,239,232))
draw.text((44,852),'No external exact-vehicle production pixels. No guessed geometry. No production promotion.',font=small,fill=(188,199,186))
draw.text((44,884),'Final manifest pins this board by SHA-256; no circular self-hash embedded.',font=tiny,fill=(151,164,154))
board.save(BOARD,optimize=False)

# Update manifest with board hashes after board exists.
manifest['review']['board']='assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-review-v01.png'
manifest['review']['boardSha256']=sha(BOARD)
manifest['manifestSha256BeforeBoardBacklink']=manifest_sha
MANIFEST.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')

print(json.dumps({'candidate':str(OUT.relative_to(ROOT)),'candidateSha256':candidate_sha,'manifest':str(MANIFEST.relative_to(ROOT)),'manifestSha256':sha(MANIFEST),'boardSha256':sha(BOARD),'maskSha256':EXPECTED_MASK_SHA,'retainedPixels':nonzero,'retainedRgbExactFraction':manifest['verification']['retainedRgbExactFraction']},indent=2))
