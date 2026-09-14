#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import numpy as np, cv2, hashlib, math, json, sys
ROOT=Path(__file__).resolve().parents[1]
P2=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-transparent-isolation-v02.png'
P3=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-transparent-isolation-v03.png'
SRC=ROOT/'references/y62-owner/IMG_4030.jpeg'
EXPECTED='67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e'

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
a2=np.array(Image.open(P2).convert('RGBA')); a3=np.array(Image.open(P3).convert('RGBA'))
assert Image.open(P3).size==(1672,615)
assert sha(P3)==EXPECTED
m2=a2[:,:,3]>0; m3=a3[:,:,3]>0
assert not np.any(m3 & ~m2), 'Candidate 03 must never add foreground opacity'
assert np.all(a3[:,:,:3][m3]==a2[:,:,:3][m3]), 'retained RGB must remain byte-identical'
removed=int(np.sum(m2 & ~m3)); assert removed==12138, removed
assert a3[:,:,3].min()==0 and a3[:,:,3].max()==255
orig=cv2.imread(str(SRC)); cand=cv2.cvtColor(a3[:,:,:3],cv2.COLOR_RGB2BGR); mask=m3.astype(np.uint8)*255
sift=cv2.SIFT_create(); k1,d1=sift.detectAndCompute(orig,None); k2,d2=sift.detectAndCompute(cand,mask)
matches=cv2.BFMatcher().knnMatch(d1,d2,k=2); good=[m for m,n in matches if m.distance<0.6*n.distance]
p1=np.float32([k1[m.queryIdx].pt for m in good]); p2=np.float32([k2[m.trainIdx].pt for m in good])
M,inliers=cv2.estimateAffinePartial2D(p1,p2,method=cv2.RANSAC,ransacReprojThreshold=1.5); keep=inliers.ravel().astype(bool)
pred=cv2.transform(p1[keep,None,:],M).reshape(-1,2); res=np.linalg.norm(pred-p2[keep],axis=1)
scale=float((M[0,0]**2+M[1,0]**2)**0.5); rot=float(math.degrees(math.atan2(M[1,0],M[0,0])))
result={'candidateId':'Y62-F34-V1-CANDIDATE-03','sha256':sha(P3),'removedPixels':removed,'newForegroundPixels':int(np.sum(m3 & ~m2)),'retainedRgbExact':True,'goodMatches':len(good),'inliers':int(keep.sum()),'inlierRatio':float(keep.mean()),'scale':scale,'rotationDeg':rot,'residualMeanPx':float(res.mean()),'residualP95Px':float(np.percentile(res,95)),'residualMaxPx':float(res.max())}
assert result['inlierRatio']>0.97
assert result['residualP95Px']<1.0
assert abs(result['rotationDeg'])<0.01
print(json.dumps(result,indent=2))
