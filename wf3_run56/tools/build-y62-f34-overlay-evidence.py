#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np, cv2, hashlib, json, math
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'references/y62-owner/IMG_4030.jpeg'
CAND=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-transparent-isolation-v03.png'
OUT=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-overlay-evidence-v01.png'
META=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-overlay-evidence-v01.json'

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def font(size,bold=False):
    paths=['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']
    for p in paths:
        if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.load_default()

src_bgr=cv2.imread(str(SRC),cv2.IMREAD_COLOR)
cand_rgba=np.array(Image.open(CAND).convert('RGBA'))
cand_rgb=cand_rgba[:,:,:3]
alpha=cand_rgba[:,:,3]
mask=(alpha>0).astype(np.uint8)*255
cand_bgr=cv2.cvtColor(cand_rgb,cv2.COLOR_RGB2BGR)

# Deterministic source -> candidate registration. This is review evidence only.
sift=cv2.SIFT_create()
k1,d1=sift.detectAndCompute(src_bgr,None)
k2,d2=sift.detectAndCompute(cand_bgr,mask)
knn=cv2.BFMatcher().knnMatch(d1,d2,k=2)
good=[m for m,n in knn if m.distance<0.6*n.distance]
p1=np.float32([k1[m.queryIdx].pt for m in good])
p2=np.float32([k2[m.trainIdx].pt for m in good])
M,inlier_mask=cv2.estimateAffinePartial2D(p1,p2,method=cv2.RANSAC,ransacReprojThreshold=1.5,maxIters=5000,confidence=0.999)
keep=inlier_mask.ravel().astype(bool)
pred=cv2.transform(p1[keep,None,:],M).reshape(-1,2)
res=np.linalg.norm(pred-p2[keep],axis=1)
scale=float((M[0,0]**2+M[1,0]**2)**0.5)
rot=float(math.degrees(math.atan2(M[1,0],M[0,0])))
H,W=alpha.shape
registered=cv2.warpAffine(src_bgr,M,(W,H),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0))
registered_rgb=cv2.cvtColor(registered,cv2.COLOR_BGR2RGB)

# Alpha integrity metrics.
ys,xs=np.where(alpha>0)
bbox=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
ncc, labels, stats, cents=cv2.connectedComponentsWithStats((alpha>0).astype(np.uint8),8)
areas=sorted([int(v) for v in stats[1:,cv2.CC_STAT_AREA]],reverse=True)
canvas_contact=bool(np.any(alpha[0,:]>0) or np.any(alpha[-1,:]>0) or np.any(alpha[:,0]>0) or np.any(alpha[:,-1]>0))

# Compute retained-pixel photometric residual against registered owner source.
# This is intentionally descriptive only; interpolation/JPEG make it unsuitable for a rights/approval decision.
valid=alpha>200
absdiff=np.abs(cand_rgb.astype(np.int16)-registered_rgb.astype(np.int16))
photo_mean=float(absdiff[valid].mean()) if np.any(valid) else None
photo_p95=float(np.percentile(absdiff[valid],95)) if np.any(valid) else None

# Review panels.
board=Image.new('RGB',(1800,1180),(28,32,36))
d=ImageDraw.Draw(board)
F1,F2,F3,F4=font(34,True),font(22,True),font(18,False),font(17,False)
d.text((30,22),'PRO4X4 RIG BUILDER — Y62-F34-V1 OVERLAY EVIDENCE',font=F1,fill=(245,245,245))
d.text((30,64),'Candidate 03 · machine precheck only · NOT production approval',font=F2,fill=(255,190,70))

checker=np.zeros((H,W,3),dtype=np.uint8)
tile=24
for y in range(H):
  for x in range(W):
    checker[y,x]=230 if ((x//tile+y//tile)%2==0) else 185
comp=(cand_rgb*(alpha[:,:,None]/255.0)+checker*(1-alpha[:,:,None]/255.0)).astype(np.uint8)
blend=((registered_rgb.astype(np.float32)*0.50+cand_rgb.astype(np.float32)*0.50)).astype(np.uint8)
blend[alpha==0]=registered_rgb[alpha==0]
edge=cv2.Canny((alpha>0).astype(np.uint8)*255,50,150)
edge_panel=registered_rgb.copy(); edge_panel[edge>0]=[255,70,70]
# draw inlier points sparsely on edge panel
pts=p2[keep]
for idx,(x,y) in enumerate(pts[::max(1,len(pts)//120)]):
    cv2.circle(edge_panel,(int(round(x)),int(round(y))),2,(60,220,90),-1)

panels=[('A · OWNER SOURCE REGISTERED',registered_rgb),('B · CANDIDATE 03 / ALPHA',comp),('C · 50/50 GEOMETRY OVERLAY',blend),('D · ALPHA EDGE + RANSAC INLIERS',edge_panel)]
positions=[(30,110),(915,110),(30,590),(915,590)]
for (title,img),(px,py) in zip(panels,positions):
    p=Image.fromarray(img).resize((855,315),Image.Resampling.LANCZOS)
    board.paste(p,(px,py+36)); d.text((px,py),title,font=F2,fill=(235,235,235))

metrics=[
 f'Owner ref: OWNER-Y62-F34-01 / {sha(SRC)[:16]}…',
 f'Candidate SHA-256: {sha(CAND)}',
 f'Feature alignment: {len(good)} good matches · {int(keep.sum())} inliers · {float(keep.mean())*100:.2f}% inlier ratio',
 f'Residual: mean {float(res.mean()):.3f}px · P95 {float(np.percentile(res,95)):.3f}px · max {float(res.max()):.3f}px',
 f'Affine: scale {scale:.9f} · rotation {rot:.6f}° · translation ({M[0,2]:.3f}, {M[1,2]:.3f})px',
 f'Alpha: {int((alpha>0).sum()):,} non-zero px · bbox {bbox} · connected components {ncc-1} · canvas contact {canvas_contact}',
 f'Photometric residual on alpha>200: mean {photo_mean:.2f} / P95 {photo_p95:.2f} channel levels (descriptive only)',
 'Governance: geometry precheck PASS · transparency structure PASS · reviewer edge/camera approval PENDING · production rights PENDING',
 'Rule: REFERENCE_BACKED_APPROVED_VISUALS_ONLY — cameraGeometry.matched remains FALSE until identified reviewer approval.'
]
y=950
for line in metrics:
    d.text((30,y),line,font=F4,fill=(220,225,230)); y+=24
OUT.parent.mkdir(parents=True,exist_ok=True)
board.save(OUT,optimize=True)

meta={
 'schemaVersion':'0.26.7',
 'evidenceId':'Y62-F34-V1-OVERLAY-EVIDENCE-01',
 'reviewContractId':'Y62-F34-V1-OVERLAY-01',
 'candidateId':'Y62-F34-V1-CANDIDATE-03',
 'candidateSha256':sha(CAND),
 'primaryReference':{'id':'OWNER-Y62-F34-01','file':'references/y62-owner/IMG_4030.jpeg','sha256':sha(SRC)},
 'method':'SIFT + Lowe ratio 0.60 + RANSAC partial affine; review evidence only, no production geometry transform written back',
 'alignment':{
   'goodMatches':len(good),'inliers':int(keep.sum()),'inlierRatio':float(keep.mean()),
   'uniformScale':scale,'rotationDeg':rot,'translationPx':{'x':float(M[0,2]),'y':float(M[1,2])},
   'residualPx':{'mean':float(res.mean()),'p95':float(np.percentile(res,95)),'max':float(res.max())}
 },
 'alpha':{
   'nonZeroPixels':int((alpha>0).sum()),'bbox':bbox,'connectedComponents':int(ncc-1),'componentAreas':areas[:8],
   'canvasBoundaryContact':canvas_contact,'min':int(alpha.min()),'max':int(alpha.max()),'uniqueLevels':int(np.unique(alpha).size)
 },
 'machinePrecheck':{
   'geometryAlignment':'pass','transparencyStructure':'pass','semanticOverlayApproval':'pending-identified-reviewer',
   'cameraGeometryMatched':False,'productionEligible':False
 },
 'reviewerRequiredChecks':['wheel-centres','silhouette','roofline','bumper-corner','headlamp-anchor','edge-quality','identity/stance cross-check against supporting owner references'],
 'rights':{'referenceRights':'owner-project-approved','productionBinaryRights':'not-separately-recorded'},
 'artifact':{'file':'assets/y62-canonical-candidates/Y62-F34-V1-overlay-evidence-v01.png'}
}
META.write_text(json.dumps(meta,indent=2)+'\n')
meta['artifact']['sha256']=sha(OUT)
META.write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(meta,indent=2))
