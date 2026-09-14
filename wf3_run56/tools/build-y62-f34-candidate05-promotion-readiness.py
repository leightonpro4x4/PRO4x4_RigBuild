#!/usr/bin/env python3
from pathlib import Path
import json, hashlib
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/y62-canonical-candidates'
OUT.mkdir(parents=True,exist_ok=True)
MAN=OUT/'Y62-F34-V1-candidate-05-promotion-readiness-v01.json'
PNG=OUT/'Y62-F34-V1-candidate-05-promotion-readiness-v01.png'

manifest={
 'schemaVersion':'0.26.24',
 'gateId':'Y62-F34-V1-CANDIDATE05-PROMOTION-READINESS-01',
 'policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
 'vehicleId':'nissan-y62-warrior-2025','viewId':'front34','candidateId':'Y62-F34-V1-CANDIDATE-05',
 'state':'READY_WAITING_CANDIDATE05',
 'purpose':'Fail-closed WF3 readiness bridge to WF5; never self-promotes or writes production state.',
 'ownerAuthenticityEvidence':['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02'],
 'requiredLineage':['Y62-F34-V1-PRO-RECON-HANDOFF-01','Y62-F34-V1-CANDIDATE05-INTAKE-01','Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01','Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01'],
 'lockedFrame':{'width':1672,'height':615,'hasAlpha':True,'alphaRawSha256':'f8c0c48381120ddb1eef0c225959955820e1f4753a3905ec96d1e87506602d05'},
 'currentReadiness':[
  {'gate':'Candidate 05 binary received','state':'PENDING'},
  {'gate':'Deterministic intake structurallyReady','state':'PENDING'},
  {'gate':'Exact SHA bound across intake/review/approval','state':'PENDING'},
  {'gate':'1672x615 alpha + locked owner-backed frame','state':'PENDING'},
  {'gate':'Fresh Candidate 05 review evidence','state':'PENDING'},
  {'gate':'Identified semantic reviewer PASS','state':'PENDING'},
  {'gate':'Series 5 Warrior identity','state':'PENDING'},
  {'gate':'Factory Warrior wheels/tyres + Premcar stance','state':'PENDING'},
  {'gate':'F34 camera/silhouette/fascia anchors','state':'PENDING'},
  {'gate':'Production-clean alpha edges','state':'PENDING'},
  {'gate':'Clean reconstruction / no scene residue','state':'PENDING'},
  {'gate':'No guessed, warped or unsupported geometry','state':'PENDING'},
  {'gate':'Production-binary rights ready','state':'PENDING'},
  {'gate':'External production source rights, if any','state':'PENDING'},
  {'gate':'Identified canonical master approval','state':'PENDING'},
  {'gate':'WF5 exact-checksum promotion','state':'NOT_RUN'}
 ],
 'authority':{'readyForWF5Only':True,'productionRegistryWriteAllowed':False,'productionEligible':False},
 'externalSourcePolicy':'Exact-vehicle images/3D remain reference-only unless source-specific production rights are separately recorded; rights do not confer geometry authority.',
 'nextDependency':'Receive professionally reconstructed Candidate 05 plus completed intake/provenance/rights manifest, then run intake and exact-checksum review.'
}
MAN.write_text(json.dumps(manifest,indent=2,sort_keys=True)+'\n',encoding='utf-8')

W,H=1800,1320
im=Image.new('RGB',(W,H),(20,23,22)); d=ImageDraw.Draw(im)
font_paths=['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']
bold_paths=['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf']
def load(paths,size):
 for p in paths:
  if Path(p).exists(): return ImageFont.truetype(p,size)
 return ImageFont.load_default()
f_title=load(bold_paths,54); f_h=load(bold_paths,28); f=load(font_paths,24); f_small=load(font_paths,19); f_mono=load(font_paths,18)
# deterministic neutral palette
sand=(213,199,166); off=(238,237,232); olive=(116,123,91); panel=(35,39,37); line=(80,86,80); muted=(174,177,169); warn=(210,180,111)
d.rectangle((0,0,W,138),fill=(27,31,29)); d.text((62,34),'Y62 F34 · CANDIDATE 05 PROMOTION READINESS',font=f_title,fill=off)
d.text((64,100),'WF3 fail-closed bridge to WF5 · no self-promotion · owner references remain authenticity authority',font=f_small,fill=sand)
# summary cards
cards=[('POLICY','REFERENCE_BACKED_\nAPPROVED_VISUALS_ONLY'),('CANDIDATE','Y62-F34-V1-\nCANDIDATE-05'),('STATE','READY · WAITING\nCANDIDATE 05'),('PRODUCTION','BLOCKED UNTIL WF5')]
x=60
for lab,val in cards:
 d.rounded_rectangle((x,168,x+405,260),12,fill=panel,outline=line,width=2)
 d.text((x+18,183),lab,font=f_small,fill=muted); d.multiline_text((x+18,213),val,font=f_small,fill=off,spacing=2)
 x+=430
# lineage
d.text((62,298),'Required lineage',font=f_h,fill=sand)
lin=['PRO-RECON-HANDOFF-01','CANDIDATE05-INTAKE-01','CAMERA-TRANSFER-CONTRACT-01','CANDIDATE05-REVIEW-PIPELINE-01']
for i,v in enumerate(lin):
 y=342+i*46; d.rounded_rectangle((62,y,838,y+36),8,fill=panel,outline=line); d.text((78,y+7),v,font=f_small,fill=off)
# locked evidence
d.text((930,298),'Locked owner-backed frame',font=f_h,fill=sand)
ev=[('Canvas','1672 × 615 RGBA'),('Alpha SHA','f8c0c48381120ddb1eef0c2259599558…'),('Primary','OWNER-Y62-F34-01'),('Support','F34-02 · FRONT-01 · FRONT-02')]
for i,(a,b) in enumerate(ev):
 y=342+i*46; d.text((932,y+4),a,font=f_small,fill=muted); d.text((1075,y+4),b,font=f_mono if 'SHA' in a else f_small,fill=off)
# gates
start=550; d.text((62,start),'Promotion readiness matrix',font=f_h,fill=sand)
items=manifest['currentReadiness']; colw=830
for idx,item in enumerate(items):
 col=0 if idx<8 else 1; row=idx if idx<8 else idx-8; x=62+col*860; y=start+52+row*73
 d.rounded_rectangle((x,y,x+820,y+58),9,fill=panel,outline=line)
 state=item['state']; badge=(warn if state in ('PENDING','NOT_RUN') else olive)
 d.rounded_rectangle((x+12,y+13,x+126,y+45),8,fill=badge)
 d.text((x+25,y+18),state,font=f_small,fill=(20,23,22))
 d.text((x+145,y+15),item['gate'],font=f_small,fill=off)
# footer
fy=1210; d.line((60,fy-22,W-60,fy-22),fill=line,width=2)
d.text((62,fy),'External exact-vehicle imagery / 3D: reference-only unless source-specific production rights are separately recorded.',font=f_small,fill=muted)
d.text((62,fy+34),'Even with rights, owner-supplied 2025 Series 5 Warrior evidence remains the geometry/authenticity authority.',font=f_small,fill=muted)
d.text((62,fy+68),'NEXT: receive Candidate 05 + completed provenance/rights intake → deterministic intake → exact-checksum review → evaluate this gate.',font=f_small,fill=sand)
im.save(PNG,optimize=False)

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
print(json.dumps({'manifest':str(MAN.relative_to(ROOT)),'manifestSha256':sha(MAN),'board':str(PNG.relative_to(ROOT)),'boardSha256':sha(PNG)},indent=2))
