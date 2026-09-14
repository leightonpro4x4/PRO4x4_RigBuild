#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import cv2, numpy as np, hashlib, json, math

ROOT=Path(__file__).resolve().parents[1]
CAND=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-neutral-reconstruction-v04.png'
OVERLAY_META=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-candidate-04-overlay-evidence-v02.json'
OUT=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-candidate-04-reviewer-signoff-pack-v02.png'
META=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-candidate-04-reviewer-signoff-pack-v02.json'
REFS=[
 ('OWNER-Y62-F34-01',ROOT/'references/y62-owner/IMG_4030.jpeg','PRIMARY F34'),
 ('OWNER-Y62-F34-02',ROOT/'references/y62-owner/IMG_3762.jpeg','SUPPORT F34'),
 ('OWNER-Y62-FRONT-01',ROOT/'references/y62-owner/IMG_4028.jpeg','PRIMARY FRONT'),
 ('OWNER-Y62-FRONT-02',ROOT/'references/y62-owner/IMG_4512.jpeg','SUPPORT FRONT'),
]

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def font(size,bold=False):
    candidates=[
      '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
      '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'
    ]
    for p in candidates:
        if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.load_default()

def fit(im,size,contain=True,bg=(20,23,26)):
    im=im.convert('RGB')
    tw,th=size
    if contain:
        im.thumbnail(size,Image.Resampling.LANCZOS)
        c=Image.new('RGB',size,bg); c.paste(im,((tw-im.width)//2,(th-im.height)//2)); return c
    ratio=max(tw/im.width,th/im.height); new=(round(im.width*ratio),round(im.height*ratio))
    im=im.resize(new,Image.Resampling.LANCZOS); x=(im.width-tw)//2; y=(im.height-th)//2
    return im.crop((x,y,x+tw,y+th))

# Load candidate and deterministic primary registration for reviewer crops.
cand=Image.open(CAND).convert('RGBA')
cand_np=np.array(cand)
alpha=cand_np[:,:,3]
checker=np.zeros((cand.height,cand.width,3),dtype=np.uint8)
tile=24
for y in range(cand.height):
    for x in range(cand.width): checker[y,x]=225 if ((x//tile+y//tile)%2==0) else 178
rgb=cand_np[:,:,:3].astype(np.float32); a=(alpha[:,:,None]/255.0)
comp=(rgb*a+checker*(1-a)).astype(np.uint8)
comp_im=Image.fromarray(comp)

src_bgr=cv2.imread(str(REFS[0][1]),cv2.IMREAD_COLOR)
cand_bgr=cv2.cvtColor(cand_np[:,:,:3],cv2.COLOR_RGB2BGR)
mask=(alpha>0).astype(np.uint8)*255
sift=cv2.SIFT_create(); k1,d1=sift.detectAndCompute(src_bgr,None); k2,d2=sift.detectAndCompute(cand_bgr,mask)
knn=cv2.BFMatcher().knnMatch(d1,d2,k=2); good=[m for m,n in knn if m.distance<0.6*n.distance]
p1=np.float32([k1[m.queryIdx].pt for m in good]); p2=np.float32([k2[m.trainIdx].pt for m in good])
M,inliers=cv2.estimateAffinePartial2D(p1,p2,method=cv2.RANSAC,ransacReprojThreshold=1.5,maxIters=5000,confidence=0.999)
reg=cv2.warpAffine(src_bgr,M,(cand.width,cand.height),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=(22,22,22))
reg_im=Image.fromarray(cv2.cvtColor(reg,cv2.COLOR_BGR2RGB))
keep=inliers.ravel().astype(bool); pred=cv2.transform(p1[keep,None,:],M).reshape(-1,2); residual=np.linalg.norm(pred-p2[keep],axis=1)
scale=float((M[0,0]**2+M[1,0]**2)**0.5); rot=float(math.degrees(math.atan2(M[1,0],M[0,0])))

# Reviewer board.
W,H=2100,1580
board=Image.new('RGB',(W,H),(20,23,26)); d=ImageDraw.Draw(board)
Fh=font(38,True); Fsub=font(22,True); Fb=font(18,False); Fbb=font(18,True); Fs=font(15,False)
d.text((36,26),'PRO4X4 RIG BUILDER — Y62-F34-V1 REVIEWER SIGNOFF PACK',font=Fh,fill=(246,246,246))
d.text((36,76),'Candidate 04 · exact-checksum owner-reference-backed · IDENTIFIED REVIEWER REQUIRED · NOT PRODUCTION APPROVAL',font=Fsub,fill=(255,188,66))

# Large candidate / registered source panels.
for title,img,x in [('A · CANDIDATE 04 / ALPHA',comp_im,36),('B · PRIMARY OWNER SOURCE REGISTERED',reg_im,1068)]:
    d.text((x,124),title,font=Fsub,fill=(235,235,235)); p=fit(img,(996,366),contain=True); board.paste(p,(x,160))

# Four owner refs.
rx=36; ry=570; pw=492; ph=300
for idx,(rid,p,label) in enumerate(REFS):
    x=rx+(idx%4)*510
    d.text((x,ry),f'{label} · {rid}',font=Fbb,fill=(225,230,232))
    board.paste(fit(Image.open(p),(pw,230),contain=False),(x,ry+30))
    d.text((x,ry+266),f'SHA {sha(p)[:16]}…',font=Fs,fill=(160,168,174))

# Semantic crop pairs from registered source vs candidate. Crop boxes are review windows, not geometry assertions.
crops=[('ROOFLINE / GLASSHOUSE',(450,15,1020,235)),('FASCIA / HEADLAMP',(700,180,1260,440)),('VISIBLE WHEEL / ARCH',(520,300,790,610))]
cy=910
for i,(name,box) in enumerate(crops):
    x=36+i*680
    d.text((x,cy),name,font=Fbb,fill=(232,232,232))
    rp=fit(reg_im.crop(box),(320,220),contain=True); cp=fit(comp_im.crop(box),(320,220),contain=True)
    board.paste(rp,(x,cy+30)); board.paste(cp,(x+326,cy+30))
    d.text((x,cy+254),'registered owner source',font=Fs,fill=(165,175,180)); d.text((x+326,cy+254),'Candidate 04',font=Fs,fill=(165,175,180))

# Gate summary.
y0=1215
d.rectangle((36,y0,2064,1545),outline=(72,79,84),width=2)
d.text((56,y0+18),'SIGNOFF GATES',font=Fsub,fill=(245,245,245))
rows=[
 ('Identity / Series 5 Warrior trim','OWNER EVIDENCE READY','Reviewer PASS / RETURN required'),
 ('Stance + factory wheel/tyre state','OWNER EVIDENCE READY','Reviewer PASS / RETURN required'),
 ('Wheel centres / silhouette / roofline','MACHINE PRECHECK PASS','Reviewer semantic signoff required'),
 ('Bumper + headlamp anchors','MACHINE PRECHECK READY','Reviewer semantic signoff required'),
 ('Compositing edge quality','MACHINE STRUCTURE PASS','Reviewer visual signoff required'),
 ('Camera geometry matched','FALSE','Must remain false until identified reviewer signs'),
 ('Direct production-binary rights','NOT RECORDED','Production remains blocked'),
 ('WF5 exact checksum gate','NOT RUN','Required after master-approved only'),
]
for i,(gate,state,action) in enumerate(rows):
    yy=y0+58+i*31
    d.text((56,yy),gate,font=Fb,fill=(220,223,226)); d.text((650,yy),state,font=Fbb,fill=(187,216,151) if 'PASS' in state or 'READY' in state else (255,184,83)); d.text((1050,yy),action,font=Fb,fill=(205,210,214))

d.text((56,1514),f'Candidate SHA-256 {sha(CAND)} · registration {len(good)} matches / {int(keep.sum())} inliers · P95 {float(np.percentile(residual,95)):.3f}px · scale {scale:.9f} · rot {rot:.6f}°',font=Fs,fill=(155,165,171))
OUT.parent.mkdir(parents=True,exist_ok=True); board.save(OUT,optimize=True)

overlay=json.loads(OVERLAY_META.read_text())
refs=[]
for rid,p,label in REFS:
    refs.append({'id':rid,'file':str(p.relative_to(ROOT)).replace('\\','/'),'sha256':sha(p),'role':label.lower().replace(' ','-'),'rights':'owner-project-approved-internal-canonical-development'})
meta={
 'schemaVersion':'0.26.11',
 'packetId':'Y62-F34-V1-REVIEWER-SIGNOFF-02',
 'candidateId':'Y62-F34-V1-CANDIDATE-04',
 'candidateSha256':sha(CAND),
 'reviewContractId':'Y62-F34-V1-OVERLAY-01',
 'overlayEvidenceId':overlay['evidenceId'],
 'overlayEvidenceSha256':overlay['artifact']['sha256'],
 'purpose':'Immutable reviewer packet for semantic camera/identity/edge signoff. It must not self-approve the candidate.',
 'referenceSet':refs,
 'machineEvidence':{
   'featureMatches':len(good),'ransacInliers':int(keep.sum()),'inlierRatio':float(keep.mean()),
   'residualP95Px':float(np.percentile(residual,95)),'uniformScale':scale,'rotationDeg':rot,
   'alphaConnectedComponents':overlay['alpha']['connectedComponents'],'canvasBoundaryContact':overlay['alpha']['canvasBoundaryContact']
 },
 'requiredReviewerChecks':[
   {'id':'identity','state':'pending-identified-reviewer','evidence':['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02']},
   {'id':'stance','state':'pending-identified-reviewer','evidence':['OWNER-Y62-F34-01','OWNER-Y62-F34-02']},
   {'id':'wheel-centres','state':'pending-identified-reviewer','machineState':'precheck-pass'},
   {'id':'silhouette','state':'pending-identified-reviewer','machineState':'precheck-pass'},
   {'id':'roofline','state':'pending-identified-reviewer','machineState':'precheck-ready'},
   {'id':'bumper-corner','state':'pending-identified-reviewer','machineState':'precheck-ready'},
   {'id':'headlamp-anchor','state':'pending-identified-reviewer','machineState':'precheck-ready'},
   {'id':'edge-quality','state':'pending-identified-reviewer','machineState':'transparency-structure-pass'},
   {'id':'no-invented-accessories','state':'pending-identified-reviewer','evidence':['candidate provenance','owner reference set']}
 ],
 'reviewDecision':{'reviewerId':None,'reviewedAt':None,'decision':'pending','cameraGeometryMatched':False,'masterState':'master-draft'},
 'rightsGate':{
   'ownerReferenceUse':'approved-for-internal-canonical-development',
   'externalProductionSourcesUsed':False,
   'directPhotoDerivedProductionBinaryRights':'not-separately-recorded',
   'productionEligibility':'blocked'
 },
 'promotionRule':'Requires identified reviewer PASS for all semantic/edge checks, separately recorded production-binary rights or rights-cleared reconstruction, master-approved state, cameraGeometry.matched=true, and WF5 gate on this exact candidate checksum.',
 'artifact':{'file':str(OUT.relative_to(ROOT)).replace('\\','/'),'sha256':sha(OUT)},
 'productionEligible':False
}
META.write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(meta,indent=2))
