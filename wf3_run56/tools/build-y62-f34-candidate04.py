#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import cv2, hashlib, json
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
ASSET_DIR=ROOT/'assets/y62-canonical-candidates'
SRC=ASSET_DIR/'Y62-F34-V1-transparent-isolation-v03.png'
ENVELOPE=ASSET_DIR/'Y62-F34-V1-neutral-reconstruction-envelope-v01.png'
OUT=ASSET_DIR/'Y62-F34-V1-neutral-reconstruction-v04.png'
PREVIEW=ASSET_DIR/'Y62-F34-V1-neutral-reconstruction-v04-preview.jpg'
DELTA=ASSET_DIR/'Y62-F34-V1-candidate-04-rgb-delta.png'
BOARD=ASSET_DIR/'Y62-F34-V1-candidate-04-review-v01.png'
META=ASSET_DIR/'Y62-F34-V1-candidate-04-build.json'
EXPECTED_SRC_SHA='67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e'
EXPECTED_ENVELOPE_SHA='7ebf9e43e9a7676253f1e09307812026b13c1809d685da7954d3b31b65d8282b'


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def font(size=24,bold=False):
    candidates=[
      '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
      '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'
    ]
    for p in candidates:
        if Path(p).exists(): return ImageFont.truetype(p,size=size)
    return ImageFont.load_default()

def checker_comp(rgba):
    h,w=rgba.shape[:2]
    yy,xx=np.indices((h,w)); checker=((xx//28+yy//28)%2)[...,None]
    bg=np.where(checker==0,np.array([236,236,236]),np.array([196,196,196])).astype(np.uint8)
    af=rgba[:,:,3].astype(np.float32)/255.0
    return (rgba[:,:,:3]*af[...,None]+bg*(1-af[...,None])).astype(np.uint8)

def fit(im,box):
    x0,y0,x1,y1=box; cp=im.copy(); cp.thumbnail((x1-x0,y1-y0),Image.Resampling.LANCZOS)
    return cp,(x0+(x1-x0-cp.width)//2,y0+(y1-y0-cp.height)//2)

def hf_rms(rgb,mask):
    gray=cv2.cvtColor(rgb,cv2.COLOR_RGB2GRAY).astype(np.float32)
    base=cv2.GaussianBlur(gray,(0,0),3)
    return float(np.sqrt(np.mean(((gray-base)[mask])**2)))

def chroma_mean(rgb,mask):
    lab=cv2.cvtColor(rgb,cv2.COLOR_RGB2LAB).astype(np.float32)
    return float(np.mean(np.sqrt((lab[:,:,1][mask]-128.0)**2+(lab[:,:,2][mask]-128.0)**2)))

if sha(SRC)!=EXPECTED_SRC_SHA: raise SystemExit('Candidate 03 checksum mismatch; refusing to retouch a different binary.')
if sha(ENVELOPE)!=EXPECTED_ENVELOPE_SHA: raise SystemExit('Retouch envelope checksum mismatch; refusing to operate outside the locked contract.')
rgba=np.array(Image.open(SRC).convert('RGBA'))
env=np.array(Image.open(ENVELOPE).convert('RGBA')).astype(np.int16)
if rgba.shape!=(615,1672,4): raise SystemExit(f'Unexpected candidate shape {rgba.shape}')
elig=(env[:,:,1]>env[:,:,0]+50)&(env[:,:,3]>0)&(rgba[:,:,3]>0)
if int(elig.sum())!=38943: raise SystemExit(f'Eligible envelope changed: {int(elig.sum())}')

src_rgb=rgba[:,:,:3]
# Conservative, deterministic RGB-only neutralisation. A bilateral/broad local base
# reduces source-scene texture and chroma inside the pre-approved interior envelope.
# No alpha, coordinates, resampling or geometry operations are performed.
bilat=cv2.bilateralFilter(src_rgb,d=0,sigmaColor=45,sigmaSpace=19).astype(np.float32)
broad=cv2.GaussianBlur(src_rgb,(0,0),sigmaX=13,sigmaY=13).astype(np.float32)
target=(0.55*bilat+0.45*broad)
orig_lab=cv2.cvtColor(src_rgb,cv2.COLOR_RGB2LAB).astype(np.float32)
targ_lab=cv2.cvtColor(np.clip(target,0,255).astype(np.uint8),cv2.COLOR_RGB2LAB).astype(np.float32)
out_lab=orig_lab.copy()
dist=cv2.distanceTransform(elig.astype(np.uint8),cv2.DIST_L2,5)
weight=np.clip(dist/7.0,0,1)*0.84
out_lab[:,:,0]=orig_lab[:,:,0]*(1-weight)+targ_lab[:,:,0]*weight
for ch in (1,2):
    local=orig_lab[:,:,ch]*(1-0.62*weight)+targ_lab[:,:,ch]*(0.62*weight)
    out_lab[:,:,ch]=128.0+(local-128.0)*(1-0.28*weight)
retouched=cv2.cvtColor(np.clip(out_lab,0,255).astype(np.uint8),cv2.COLOR_LAB2RGB)
out=rgba.copy(); out[elig,:3]=retouched[elig]

# Contract invariants: alpha and every RGB pixel outside the eligible envelope are byte-identical.
if not np.array_equal(out[:,:,3],rgba[:,:,3]): raise SystemExit('Alpha changed; rejecting Candidate 04 build.')
if not np.array_equal(out[~elig,:3],rgba[~elig,:3]): raise SystemExit('RGB changed outside the locked retouch envelope; rejecting Candidate 04 build.')
Image.fromarray(out,'RGBA').save(OUT,optimize=True)
Image.fromarray(checker_comp(out),'RGB').save(PREVIEW,quality=94)

changed=np.any(out[:,:,:3]!=rgba[:,:,:3],axis=2)
delta=np.abs(out[:,:,:3].astype(np.int16)-rgba[:,:,:3].astype(np.int16))
# Delta evidence: transparent outside envelope; intensity shows maximum channel delta.
vis=np.zeros_like(out); mag=delta.max(axis=2).astype(np.uint8)
scale=np.clip(mag.astype(np.float32)/max(1,float(mag[elig].max()))*255,0,255).astype(np.uint8)
vis[elig]=np.stack([np.maximum(scale[elig],60),np.minimum(scale[elig]//3,90),np.zeros(int(elig.sum()),dtype=np.uint8),np.where(changed[elig],220,90).astype(np.uint8)],axis=1)
Image.fromarray(vis,'RGBA').save(DELTA,optimize=True)

before_hf=hf_rms(src_rgb,elig); after_hf=hf_rms(out[:,:,:3],elig)
before_chroma=chroma_mean(src_rgb,elig); after_chroma=chroma_mean(out[:,:,:3],elig)
metrics={
 'eligiblePixels':int(elig.sum()),
 'changedEligiblePixels':int(np.sum(changed&elig)),
 'changedOutsideEnvelopePixels':int(np.sum(changed&~elig)),
 'changedEligiblePct':round(float(np.sum(changed&elig)/elig.sum()*100),4),
 'meanAbsChannelDelta':round(float(delta[elig].mean()),4),
 'p95AbsChannelDelta':round(float(np.percentile(delta[elig],95)),4),
 'maxAbsChannelDelta':int(delta[elig].max()),
 'highFrequencyRmsBefore':round(before_hf,6),'highFrequencyRmsAfter':round(after_hf,6),
 'highFrequencyRmsReductionPct':round((before_hf-after_hf)/before_hf*100,4),
 'meanLabChromaBefore':round(before_chroma,6),'meanLabChromaAfter':round(after_chroma,6),
 'meanLabChromaReductionPct':round((before_chroma-after_chroma)/before_chroma*100,4),
 'alphaByteIdentical':True,'outsideEnvelopeRgbByteIdentical':True
}

# Staff review board: before/after/delta and immutable status.
W,H=1672,1160; board=Image.new('RGB',(W,H),(20,23,26)); d=ImageDraw.Draw(board)
white=(244,246,247); muted=(174,182,187); line=(72,81,87); green=(70,215,140); amber=(245,187,75); red=(236,83,83)
d.text((36,26),'PRO4X4 RIG BUILDER · WF3',fill=white,font=font(34,True))
d.text((36,72),'Y62-F34-V1 · CANDIDATE 04 · GEOMETRY-LOCKED NEUTRALISATION',fill=white,font=font(28,True))
d.text((36,111),'Owner-reference-derived · RGB edits inside locked envelope only · master-draft / review only',fill=muted,font=font(20))
boxes=[((36,156,540,468),'A · Candidate 03'),((584,156,1088,468),'B · Candidate 04'),((1132,156,1636,468),'C · RGB delta')]
ims=[Image.fromarray(checker_comp(rgba),'RGB'),Image.fromarray(checker_comp(out),'RGB')]
# Delta composite on checkerboard
v=np.array(Image.open(DELTA).convert('RGBA')); ims.append(Image.fromarray(checker_comp(v),'RGB'))
for (box,title),im in zip(boxes,ims):
    d.rounded_rectangle(box,radius=10,outline=line,width=2,fill=(29,33,37)); d.text((box[0]+16,box[1]+12),title,fill=white,font=font(19,True)); fi,pos=fit(im,(box[0]+10,box[1]+48,box[2]-10,box[3]-10)); board.paste(fi,pos)
y=500; d.rounded_rectangle((36,y,1636,1090),radius=12,outline=line,width=2,fill=(29,33,37))
d.text((60,y+22),'CANDIDATE 04 BUILD GATE',fill=white,font=font(25,True))
rows=[
 ('PASS','Alpha mask','Byte-identical to Candidate 03; no silhouette or compositing-boundary edits.',green),
 ('PASS','Geometry','No resampling, warp, coordinate transform, wheel/tyre replacement or new vehicle pixels.',green),
 ('PASS','Retouch boundary',f"{metrics['changedEligiblePixels']:,} changed pixels are inside the 38,943-pixel envelope; 0 outside-envelope pixels changed.",green),
 ('PASS','Neutralisation proxy',f"Eligible-region high-frequency RMS reduced {metrics['highFrequencyRmsReductionPct']:.2f}% and mean LAB chroma reduced {metrics['meanLabChromaReductionPct']:.2f}%.",green),
 ('HOLD','Clean reconstruction','Locked photographic reflection edges/details remain by design; this conservative pass does not justify a clean-neutral-master claim.',amber),
 ('HOLD','Camera/reviewer','Locked overlay and reviewer packet must be regenerated against Candidate 04 exact checksum; identified reviewer decision remains absent.',amber),
 ('HOLD','Production rights','Owner references support internal canonical development; final photo-derived/retouched production-binary rights remain unrecorded.',amber),
 ('BLOCK','Customer production','REFERENCE_BACKED_APPROVED_VISUALS_ONLY: master-draft remains unavailable to resolver/quotes/product layers.',red)
]
yy=y+72
for state,label,note,color in rows:
    d.rounded_rectangle((60,yy,138,yy+34),radius=6,fill=color); d.text((72,yy+6),state,fill=(15,15,15),font=font(15,True)); d.text((156,yy+1),label,fill=white,font=font(18,True));
    # short wrap
    words=note.split(); lines=[]; cur=''; f=font(17)
    for word in words:
        t=(cur+' '+word).strip()
        if d.textlength(t,font=f)>1230 and cur: lines.append(cur); cur=word
        else: cur=t
    if cur: lines.append(cur)
    for i,t in enumerate(lines[:2]): d.text((156,yy+24+i*21),t,fill=muted,font=f)
    yy+=62 if len(lines)<=1 else 78

d.text((36,1120),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · CANDIDATE 04 MASTER-DRAFT · NOT CUSTOMER PRODUCTION',fill=amber,font=font(18,True))
board.save(BOARD,optimize=True)

meta={
 'schemaVersion':'0.26.10','candidateId':'Y62-F34-V1-CANDIDATE-04','sourceCandidateId':'Y62-F34-V1-CANDIDATE-03','contractId':'Y62-F34-V1-NEUTRAL-RECONSTRUCTION-01',
 'process':'deterministic RGB-only neutralisation inside the checksum-pinned Candidate 03 retouch envelope; alpha and all outside-envelope RGB bytes remain unchanged; no geometry or resampling operation',
 'referenceIds':['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02'],'externalExactVehicleProductionSourcesUsed':False,
 'canvas':{'width':1672,'height':615},'metrics':metrics,
 'rightsState':{'ownerReferences':'internal-canonical-development-approved','productionBinaryRights':'not-separately-recorded'},
 'reviewState':'candidate-review-ready','governanceState':'master-draft','cameraGeometryMatched':False,'productionEligible':False,
 'knownHold':'The locked envelope intentionally leaves many photographed reflection/detail edges unchanged; Candidate 04 is a conservative neutralisation attempt, not a clean canonical reconstruction approval.',
 'sha256':sha(OUT),'previewSha256':sha(PREVIEW),'deltaSha256':sha(DELTA),'reviewBoardSha256':sha(BOARD),
 'nextDependency':'Regenerate the locked F34 overlay evidence and reviewer signoff packet against Candidate 04 exact checksum. If reflection/scene residue still fails semantic review, do not widen the contract by inference; route to rights-cleared professional reconstruction or retain as review-only evidence.'
}
META.write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
print(json.dumps(meta,indent=2))
