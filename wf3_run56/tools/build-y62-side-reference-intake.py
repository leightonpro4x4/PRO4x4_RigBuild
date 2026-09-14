#!/usr/bin/env python3
from PIL import Image, ImageOps, ImageDraw, ImageFont
from pathlib import Path
import hashlib, json
ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references'/'y62-owner'
OUT=ROOT/'assets'/'y62-canonical-candidates'
OUT.mkdir(parents=True,exist_ok=True)

def sha(p):
    h=hashlib.sha256(); h.update(p.read_bytes()); return h.hexdigest()

def fit(im, box):
    return ImageOps.contain(im.convert('RGB'), box, Image.Resampling.LANCZOS)

def font(size,bold=False):
    paths=['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']
    for p in paths:
        if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.load_default()

files={
 'design':'5E67BCCD-7780-4D9E-B83F-418F253D64B3.jpeg',
 'f34':'IMG_4030.jpeg',
 'r34':'IMG_4540.jpeg',
 'rear':'IMG_4508.jpeg'
}
W,H=1800,1120
canvas=Image.new('RGB',(W,H),(20,22,23)); d=ImageDraw.Draw(canvas)
d.text((60,42),'Y62-SIDE-V1 · OWNER REFERENCE INTAKE 01',font=font(42,True),fill=(244,244,238))
d.text((60,96),'2025 Series 5 Patrol Warrior · REFERENCE_BACKED_APPROVED_VISUALS_ONLY',font=font(22),fill=(184,190,184))
# status banner
banner=(60,142,1740,220); d.rounded_rectangle(banner,18,fill=(82,43,24),outline=(205,139,69),width=2)
d.text((88,160),'SOURCE GAP CONFIRMED — NO CLEAN RAW SQUARE-ON OWNER SIDE PHOTO',font=font(29,True),fill=(255,224,181))
d.text((88,196),'No SIDE candidate may be created or promoted from the current pack.',font=font(18),fill=(244,227,210))
# panels
panels=[('DESIGN BOARD · SECONDARY ONLY','design',(60,260,930,690)),('F34 OWNER RAW · AUTHENTICITY SUPPORT','f34',(970,260,1740,600)),('R34 OWNER RAW · AUTHENTICITY SUPPORT','r34',(970,625,1350,875)),('REAR OWNER RAW · AUTHENTICITY SUPPORT','rear',(1360,625,1740,875))]
for title,key,box in panels:
    x0,y0,x1,y1=box
    d.rounded_rectangle(box,14,fill=(31,34,35),outline=(80,85,84),width=2)
    d.text((x0+18,y0+14),title,font=font(17,True),fill=(235,235,228))
    p=REF/files[key]; im=fit(Image.open(p),(x1-x0-36,y1-y0-76))
    ix=x0+(x1-x0-im.width)//2; iy=y0+50+(y1-y0-60-im.height)//2
    canvas.paste(im,(ix,iy))
    d.text((x0+18,y1-25),f'{files[key]} · sha256 {sha(p)[:12]}…',font=font(12),fill=(151,158,155))
# footer findings
fy=910
d.text((60,fy),'INTAKE DECISION',font=font(19,True),fill=(244,244,238)); fy+=34
for line in [
 'PASS · Owner pack proves vehicle identity, factory Warrior rolling stock, Premcar stance, front and rear quarter geometry.',
 'HOLD · Composite design board shows a side orientation but is derivative / upstream pixel provenance is not separately recorded.',
 'BLOCK · No raw square-on side camera source. Oblique F34/R34 photos must not be perspective-warped into a side master.',
 'NEXT · Supply clean square-on owner side photo OR rights-cleared measured reconstruction source; then build/checksum a SIDE candidate.'
]:
    d.text((78,fy),'• '+line,font=font(16),fill=(213,216,211)); fy+=31
board=OUT/'Y62-SIDE-V1-owner-reference-intake-v01.png'; canvas.save(board,optimize=True)
manifest={
 'schemaVersion':'0.26.16','intakeId':'Y62-SIDE-V1-OWNER-REFERENCE-INTAKE-01','vehicleId':'nissan-y62-warrior-2025','viewId':'side','policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
 'decision':'SOURCE_GAP_CONFIRMED','candidateCreationAllowed':False,'cameraLockAllowed':False,'productionEligible':False,
 'ownerReferenceVerification':[],
 'board':str(board.relative_to(ROOT)).replace('\\','/'),'boardSha256':sha(board),
 'sideSource':{'cleanRawSquareOnOwnerSide':False,'derivativeDesignBoardSidePresent':True,'derivativeDesignBoardProductionPixelUse':'prohibited'},
 'nextDependency':'Clean square-on raw owner side photo or separately rights-cleared measured reconstruction source with explicit provenance.'
}
for p in sorted(REF.glob('*')):
    with Image.open(p) as im:
        manifest['ownerReferenceVerification'].append({'file':str(p.relative_to(ROOT)).replace('\\','/'),'width':im.width,'height':im.height,'sha256':sha(p)})
manifest_path=OUT/'Y62-SIDE-V1-owner-reference-intake-v01.json'; manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'board':str(board),'boardSha256':sha(board),'manifest':str(manifest_path),'references':len(manifest['ownerReferenceVerification'])},indent=2))
