#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import numpy as np
import cv2, hashlib, json

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-transparent-isolation-v02.png'
OUT=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-transparent-isolation-v03.png'
PREVIEW=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-transparent-isolation-v03-preview.jpg'
DELTA=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-candidate-03-mask-delta.png'
META=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-candidate-03-build.json'

rgba=np.array(Image.open(SRC).convert('RGBA'))
rgb_bgr=cv2.cvtColor(rgba[:,:,:3],cv2.COLOR_RGB2BGR)
alpha=rgba[:,:,3]

# Candidate 03 remains strictly non-generative. It re-segments Candidate 02 source
# pixels with GrabCut, anchored by the existing alpha mask. No RGB pixel inside the
# retained mask is altered and no perspective/geometry operation is applied.
mask=np.full(alpha.shape,cv2.GC_BGD,np.uint8)
mask[alpha>0]=cv2.GC_PR_FGD
# Keep only deep interior as definite foreground so edge-attached source-scene
# pixels can be reclassified without touching the vehicle core.
eroded=cv2.erode((alpha>128).astype(np.uint8),np.ones((41,41),np.uint8),iterations=2)
mask[eroded>0]=cv2.GC_FGD
bgd=np.zeros((1,65),np.float64); fgd=np.zeros((1,65),np.float64)
cv2.grabCut(rgb_bgr,mask,None,bgd,fgd,7,cv2.GC_INIT_WITH_MASK)
seg=np.where((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD),255,0).astype(np.uint8)
# Drop detached noise; the actual vehicle must remain the dominant connected region.
n,labels,stats,_=cv2.connectedComponentsWithStats((seg>0).astype(np.uint8),8)
if n<2: raise RuntimeError('segmentation produced no foreground component')
largest=1+np.argmax(stats[1:,cv2.CC_STAT_AREA])
seg=np.where(labels==largest,255,0).astype(np.uint8)

# Safe targeted cleanup of a known roll-door fragment left of the rear wheel.
# This polygon lies wholly outside the vehicle silhouette in OWNER-Y62-F34-01.
poly=np.array([[445,307],[468,307],[468,348],[461,348],[461,401],[445,401]],np.int32)
cv2.fillPoly(seg,[poly],0)

# Feather only the binary segmentation boundary; never add opacity outside Candidate 02.
seg=cv2.GaussianBlur(seg,(3,3),0)
new_alpha=np.minimum(alpha,seg)
out=rgba.copy(); out[:,:,3]=new_alpha
Image.fromarray(out,'RGBA').save(OUT,optimize=True)

# Checkerboard preview for staff review.
h,w=new_alpha.shape
yy,xx=np.indices((h,w)); checker=((xx//28+yy//28)%2)[...,None]
bg=np.where(checker==0,np.array([236,236,236]),np.array([196,196,196])).astype(np.uint8)
af=new_alpha.astype(np.float32)/255.0
comp=(out[:,:,:3]*af[...,None]+bg*(1-af[...,None])).astype(np.uint8)
Image.fromarray(comp,'RGB').save(PREVIEW,quality=94)

# Delta visual: red = pixels removed from Candidate 02, white = retained alpha.
old=(alpha>0); new=(new_alpha>0); removed=old & ~new
vis=np.zeros((h,w,4),np.uint8)
vis[new]=[255,255,255,210]
vis[removed]=[255,60,40,255]
Image.fromarray(vis,'RGBA').save(DELTA,optimize=True)

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()
ys,xs=np.where(new_alpha>0)
meta={
  'schemaVersion':'0.26.6',
  'candidateId':'Y62-F34-V1-CANDIDATE-03',
  'sourceCandidateId':'Y62-F34-V1-CANDIDATE-02',
  'process':'non-generative edge cleanup: GrabCut re-segmentation + one owner-reference-verified background exclusion polygon; RGB source pixels unchanged',
  'canvas':{'width':w,'height':h},
  'alpha':{
    'oldNonZeroPixels':int(old.sum()),
    'newNonZeroPixels':int(new.sum()),
    'removedPixels':int(removed.sum()),
    'removedPercentOfPriorMask':round(float(removed.sum()/old.sum()*100),4),
    'bbox':[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())],
    'min':int(new_alpha.min()),'max':int(new_alpha.max()),
    'uniqueLevels':int(np.unique(new_alpha).size)
  },
  'sha256':sha(OUT),
  'previewSha256':sha(PREVIEW),
  'deltaSha256':sha(DELTA)
}
META.write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(meta,indent=2))
