#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib, json, numpy as np

ROOT=Path(__file__).resolve().parents[1]
CAND=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-neutral-reconstruction-v04.png'
OWNER=ROOT/'references/y62-owner/IMG_4030.jpeg'
OVERLAY=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-candidate-04-overlay-evidence-v02.json'
MASK=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-camera-transfer-mask-v01.png'
BOARD=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-camera-transfer-contract-v01.png'
META=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-camera-transfer-contract-v01.json'

def sha_file(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def font(size,bold=False):
    for p in [
      '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
      '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']:
        if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.load_default()

def fit(im,size,bg=(25,28,31)):
    im=im.convert('RGB'); tw,th=size
    im.thumbnail(size,Image.Resampling.LANCZOS)
    out=Image.new('RGB',size,bg); out.paste(im,((tw-im.width)//2,(th-im.height)//2)); return out

rgba=Image.open(CAND).convert('RGBA')
arr=np.array(rgba); alpha=arr[:,:,3]
ys,xs=np.nonzero(alpha)
bbox=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
centroid=[round(float(xs.mean()),6),round(float(ys.mean()),6)]
alpha_sha=hashlib.sha256(alpha.tobytes()).hexdigest()
binary_mask=(alpha>0).astype(np.uint8)
binary_mask_sha=hashlib.sha256(binary_mask.tobytes()).hexdigest()
mask_img=Image.fromarray(binary_mask*255,mode='L')
MASK.parent.mkdir(parents=True,exist_ok=True)
mask_img.save(MASK,optimize=True)

overlay=json.loads(OVERLAY.read_text())
reg=overlay['alignment']
meta={
 'schemaVersion':'0.26.20',
 'contractId':'Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01',
 'policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
 'vehicleId':'nissan-y62-warrior-2025',
 'viewId':'front34',
 'purpose':'Freeze the owner-backed F34 2D coordinate frame, silhouette/alpha envelope and source-to-canvas registration evidence for Candidate 05 reconstruction without authorising new geometry.',
 'authority':{
   'primaryAuthenticityReference':{'id':'OWNER-Y62-F34-01','file':'references/y62-owner/IMG_4030.jpeg','sha256':sha_file(OWNER)},
   'supportingReferenceIds':['OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02'],
   'predecessorCandidate':{'id':'Y62-F34-V1-CANDIDATE-04','file':'assets/y62-canonical-candidates/Y62-F34-V1-neutral-reconstruction-v04.png','sha256':sha_file(CAND),'state':'returned-professional-reconstruction-required'},
   'overlayEvidence':{'id':overlay['evidenceId'],'file':overlay['artifact']['file'],'sha256':overlay['artifact']['sha256']},
   'externalExactVehicleGeometryAuthority':False
 },
 'canonicalCoordinateFrame':{
   'canvas':{'width':rgba.width,'height':rgba.height},
   'alphaMask':{'file':'assets/y62-canonical-candidates/Y62-F34-V1-camera-transfer-mask-v01.png','sha256':sha_file(MASK),'alphaRawSha256':alpha_sha,'binaryMaskRawSha256':binary_mask_sha,'nonZeroPixels':int(binary_mask.sum()),'bbox':bbox,'centroidPx':centroid,'connectedComponents':overlay['alpha']['connectedComponents'],'canvasBoundaryContact':overlay['alpha']['canvasBoundaryContact']},
   'sourceToCanonicalEvidence':{
      'method':overlay['method'],
      'uniformScale':reg['uniformScale'],'rotationDeg':reg['rotationDeg'],'translationPx':reg['translationPx'],'residualPx':reg['residualPx'],'goodMatches':reg['goodMatches'],'inliers':reg['inliers'],'inlierRatio':reg['inlierRatio'],
      'use':'verification evidence only; never permission to warp/reframe a replacement candidate'
   }
 },
 'candidate05TransferRules':[
   'Output remains exactly 1672x615 RGBA.',
   'No crop, canvas shift, perspective warp, non-uniform scaling or camera reframing.',
   'Alpha must be byte-identical to the locked Candidate 04 alpha mask unless a separately recorded pre-authorised geometry exception exists before editing.',
   'RGB cleanup/reconstruction may not relocate, invent or reshape body, glass, fascia, lamps, wheels, tyres, trim or accessories.',
   'Any external 3D or exact-vehicle source remains reference-only until source-specific rights are recorded; rights alone do not confer geometry authority.',
   'A 3D reconstruction source, if later cleared, must be rendered into this owner-backed coordinate frame and still pass fresh exact-checksum overlay + identified semantic review.',
   'CameraGeometryMatched remains false until Candidate 05 exact-checksum reviewer approval; this contract cannot self-promote.'
 ],
 'acceptance':{
   'candidate05Received':False,'cameraTransferContractReady':True,'geometryExceptionPreAuthorised':False,'cameraGeometryMatched':False,'productionEligible':False,
   'nextGate':'Candidate 05 deterministic intake against this coordinate frame, then fresh exact-checksum overlay/reviewer evidence.'
 },
 'artifact':{'file':'assets/y62-canonical-candidates/Y62-F34-V1-camera-transfer-contract-v01.png'}
}

# Build compact reviewer board.
board=Image.new('RGB',(1800,1120),(27,31,34)); d=ImageDraw.Draw(board)
Fh,Fsub,Fb,Fr=font(34,True),font(21,True),font(18,True),font(17,False)
d.text((34,24),'PRO4X4 RIG BUILDER — Y62 F34 CAMERA TRANSFER CONTRACT',font=Fh,fill=(244,244,244))
d.text((34,70),'Candidate 05 coordinate lock · owner-backed · geometry-neutral · NOT production approval',font=Fsub,fill=(255,192,78))
owner=fit(Image.open(OWNER),(820,430)); cand_bg=Image.new('RGB',rgba.size,(220,220,220)); cand_bg.paste(rgba,mask=rgba.getchannel('A')); cand=fit(cand_bg,(820,430))
board.paste(owner,(34,116)); board.paste(cand,(946,116))
d.text((34,555),'A · PRIMARY OWNER AUTHENTICITY / CAMERA SOURCE',font=Fb,fill=(225,230,232))
d.text((946,555),'B · LOCKED CANONICAL COORDINATE FRAME (CANDIDATE 04)',font=Fb,fill=(225,230,232))
# Mask panel and rules.
mask_vis=Image.new('RGB',rgba.size,(25,28,31)); m=np.array(mask_img); mv=np.array(mask_vis); mv[m>0]=[235,235,235]; mask_vis=Image.fromarray(mv)
board.paste(fit(mask_vis,(820,300)),(34,615))
d.text((34,925),'C · ALPHA / SILHOUETTE TRANSFER MASK',font=Fb,fill=(225,230,232))
metrics=[
 f'Canvas: {rgba.width}×{rgba.height} · alpha bbox: {bbox} · non-zero alpha: {int(binary_mask.sum()):,} px',
 f'Alpha raw SHA-256: {alpha_sha}',
 f'Mask PNG SHA-256: {sha_file(MASK)}',
 f'Owner→canonical evidence: scale {reg["uniformScale"]:.9f} · rot {reg["rotationDeg"]:.6f}° · tx {reg["translationPx"]["x"]:.3f} · ty {reg["translationPx"]["y"]:.3f}px',
 f'RANSAC: {reg["goodMatches"]} matches / {reg["inliers"]} inliers · P95 residual {reg["residualPx"]["p95"]:.3f}px'
]
y=962
for line in metrics:
    d.text((34,y),line,font=Fr,fill=(205,212,216)); y+=27
rules=[
 'NO crop / reframe / perspective warp / non-uniform scaling',
 'ALPHA must remain byte-identical unless geometry exception is pre-authorised',
 'NO invented body / glass / fascia / lamp / wheel / tyre / trim geometry',
 'EXTERNAL 3D remains reference-only until rights + authenticity are separately cleared',
 'FRESH exact-checksum overlay + identified reviewer required for Candidate 05',
 'cameraGeometryMatched = FALSE · productionEligible = FALSE'
]
d.text((946,615),'TRANSFER RULES',font=Fsub,fill=(245,245,245)); yy=660
for r in rules:
    d.text((968,yy),'• '+r,font=Fr,fill=(220,224,227)); yy+=48
BOARD.parent.mkdir(parents=True,exist_ok=True); board.save(BOARD,optimize=True)
meta['artifact']['sha256']=sha_file(BOARD)
META.write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(meta,indent=2))
