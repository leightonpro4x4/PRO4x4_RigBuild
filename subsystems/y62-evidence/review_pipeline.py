#!/usr/bin/env python3
import argparse, hashlib, json, math, sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Owner imagery is an explicit fixture/input; no historical application root is used.
OWNER=None
EXPECTED_ID='Y62-F34-V1-CANDIDATE-05'
INTAKE_ID='Y62-F34-V1-CANDIDATE05-INTAKE-01'
CAMERA_ID='Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01'
EXPECTED_SIZE=(1672,615)
EXPECTED_ALPHA='f8c0c48381120ddb1eef0c225959955820e1f4753a3905ec96d1e87506602d05'
C04_SHA='bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1'


def sha_bytes(b): return hashlib.sha256(b).hexdigest()
def sha_file(p): return sha_bytes(Path(p).read_bytes())
def font(size,bold=False):
    paths=['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']
    for p in paths:
        if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.load_default()

def fit(img, box):
    x,y,w,h=box; im=img.copy(); im.thumbnail((w,h),Image.Resampling.LANCZOS)
    bg=Image.new('RGB',(w,h),(18,21,24)); bg.paste(im,((w-im.width)//2,(h-im.height)//2)); return bg

def fail(msg, json_out=None):
    result={'pipelineId':'Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01','reviewGenerationAllowed':False,'issues':[msg],'cameraGeometryMatched':False,'masterApproved':False,'productionEligible':False}
    text=json.dumps(result,indent=2)
    print(text)
    if json_out: Path(json_out).write_text(text+'\n')
    sys.exit(2)

def main(argv=None):
    global OWNER
    ap=argparse.ArgumentParser(description='Generate checksum-specific Candidate 05 F34 owner-overlay/reviewer evidence. Never promotes production.')
    ap.add_argument('candidate'); ap.add_argument('intake_result'); ap.add_argument('intake_manifest')
    ap.add_argument('--out-dir',required=True)
    ap.add_argument('--json-out')
    ap.add_argument('--owner-reference', required=True)
    args=ap.parse_args(argv)
    OWNER=Path(args.owner_reference)
    cand=Path(args.candidate); intake_p=Path(args.intake_result); manifest_p=Path(args.intake_manifest); outdir=Path(args.out_dir)
    if not cand.exists(): fail('candidate file missing',args.json_out)
    if not intake_p.exists(): fail('intake result missing',args.json_out)
    if not manifest_p.exists(): fail('intake manifest missing',args.json_out)
    try: intake=json.loads(intake_p.read_text()); manifest=json.loads(manifest_p.read_text())
    except Exception as e: fail(f'input JSON invalid: {e}',args.json_out)
    issues=[]
    if intake.get('contractId')!=INTAKE_ID or intake.get('candidateId')!=EXPECTED_ID or intake.get('structurallyReady') is not True: issues.append('Candidate 05 deterministic intake must be structurallyReady=true for the expected contract/candidate')
    if manifest.get('contractId')!=INTAKE_ID or manifest.get('candidateId')!=EXPECTED_ID: issues.append('intake manifest contract/candidate mismatch')
    if manifest.get('cameraTransferContractId')!=CAMERA_ID: issues.append('intake manifest camera-transfer contract mismatch')
    csha=sha_file(cand)
    if csha==C04_SHA: issues.append('Candidate 04 cannot be reused as Candidate 05 review evidence')
    if (intake.get('binary') or {}).get('sha256')!=csha: issues.append('candidate SHA-256 does not match deterministic intake result')
    try:
        im=Image.open(cand).convert('RGBA'); arr=np.array(im)
        if im.size!=EXPECTED_SIZE: issues.append(f'candidate dimensions {im.size} != {EXPECTED_SIZE}')
        alpha=arr[:,:,3]; alpha_sha=sha_bytes(alpha.tobytes())
        geom_exc=(manifest.get('geometryException') or {}).get('preAuthorised') is True
        if alpha_sha!=EXPECTED_ALPHA and not geom_exc: issues.append('candidate alpha does not match locked camera-transfer coordinate frame')
    except Exception as e:
        issues.append(f'candidate image invalid: {e}'); arr=None
    if issues:
        result={'pipelineId':'Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01','candidateId':EXPECTED_ID,'candidateSha256':csha,'reviewGenerationAllowed':False,'issues':issues,'cameraGeometryMatched':False,'masterApproved':False,'productionEligible':False}
        text=json.dumps(result,indent=2); print(text)
        if args.json_out: Path(args.json_out).write_text(text+'\n')
        sys.exit(2)

    owner_bgr=cv2.imread(str(OWNER),cv2.IMREAD_COLOR)
    cand_rgb=arr[:,:,:3]; cand_bgr=cv2.cvtColor(cand_rgb,cv2.COLOR_RGB2BGR); mask=(arr[:,:,3]>0).astype(np.uint8)*255
    sift=cv2.SIFT_create(); k1,d1=sift.detectAndCompute(owner_bgr,None); k2,d2=sift.detectAndCompute(cand_bgr,mask)
    if d1 is None or d2 is None: fail('insufficient visual features for deterministic owner registration',args.json_out)
    knn=cv2.BFMatcher().knnMatch(d1,d2,k=2); good=[m for m,n in knn if m.distance<0.6*n.distance]
    if len(good)<4: fail('insufficient good matches for owner registration',args.json_out)
    p1=np.float32([k1[m.queryIdx].pt for m in good]); p2=np.float32([k2[m.trainIdx].pt for m in good])
    M,inmask=cv2.estimateAffinePartial2D(p1,p2,method=cv2.RANSAC,ransacReprojThreshold=1.5,maxIters=5000,confidence=0.999)
    if M is None or inmask is None: fail('owner registration failed',args.json_out)
    keep=inmask.ravel().astype(bool); pred=cv2.transform(p1[keep,None,:],M).reshape(-1,2); res=np.linalg.norm(pred-p2[keep],axis=1)
    scale=float((M[0,0]**2+M[1,0]**2)**0.5); rot=float(math.degrees(math.atan2(M[1,0],M[0,0])))
    metrics={'goodMatches':len(good),'inliers':int(keep.sum()),'inlierRatio':float(keep.mean()),'uniformScale':scale,'rotationDeg':rot,'translationPx':{'x':float(M[0,2]),'y':float(M[1,2])},'residualPx':{'mean':float(res.mean()),'p95':float(np.percentile(res,95)),'max':float(res.max())}}
    thresholds={'minimumGoodMatches':300,'minimumInliers':250,'minimumInlierRatio':0.90,'maximumResidualP95Px':2.0,'maximumAbsRotationDeg':0.10}
    precheck=(metrics['goodMatches']>=300 and metrics['inliers']>=250 and metrics['inlierRatio']>=0.90 and metrics['residualPx']['p95']<=2.0 and abs(metrics['rotationDeg'])<=0.10)
    H,W=arr.shape[:2]; registered=cv2.warpAffine(owner_bgr,M,(W,H),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0)); reg_rgb=cv2.cvtColor(registered,cv2.COLOR_BGR2RGB)
    checker=np.zeros((H,W,3),dtype=np.uint8); tile=24
    yy,xx=np.indices((H,W)); checker[:]=np.where((((xx//tile+yy//tile)%2)==0)[...,None],224,192)
    a=arr[:,:,3:4].astype(np.float32)/255; comp=(cand_rgb*a+checker*(1-a)).astype(np.uint8)
    overlay=(0.5*cand_rgb+0.5*reg_rgb).astype(np.uint8); overlay[arr[:,:,3]==0]=checker[arr[:,:,3]==0]
    board=Image.new('RGB',(1800,1200),(27,30,34)); d=ImageDraw.Draw(board); F1,F2,F3=font(34,True),font(21,True),font(18,False)
    d.text((32,24),'PRO4X4 RIG BUILDER — Y62-F34-V1 CANDIDATE 05 REVIEW',font=F1,fill=(245,245,245)); d.text((32,68),f'Exact candidate SHA-256: {csha}',font=F3,fill=(210,214,218)); d.text((32,96),'MACHINE PRECHECK ONLY — IDENTIFIED REVIEWER REQUIRED — NOT PRODUCTION APPROVAL',font=F2,fill=(255,190,70))
    panels=[('OWNER F34 PRIMARY',Image.open(OWNER).convert('RGB')),('CANDIDATE 05',Image.fromarray(comp)),('50/50 REGISTERED OVERLAY',Image.fromarray(overlay))]
    xs=[30,610,1190]
    for x,(label,img) in zip(xs,panels):
        d.text((x,145),label,font=F2,fill=(240,240,240)); board.paste(fit(img,(x,180,550,390)),(x,180))
    y=600; d.text((32,y),'Machine registration evidence',font=F2,fill=(240,240,240)); y+=38
    lines=[f"good matches {metrics['goodMatches']} | inliers {metrics['inliers']} | inlier ratio {metrics['inlierRatio']:.4f}",f"scale {metrics['uniformScale']:.6f} | rotation {metrics['rotationDeg']:.5f} deg | residual P95 {metrics['residualPx']['p95']:.3f}px",f"machine threshold result: {'PASS' if precheck else 'RETURN FOR REVIEW'}",'Owner source remains primary authenticity evidence. Machine registration cannot approve camera geometry or production.']
    for line in lines: d.text((32,y),line,font=F3,fill=(220,224,228)); y+=30
    y+=10; d.text((32,y),'Mandatory identified-reviewer checks',font=F2,fill=(240,240,240)); y+=36
    checks=['Series 5 Warrior identity','factory Warrior wheels/tyres + Premcar stance','F34 camera perspective','silhouette + roofline/glasshouse','front fascia/bumper + headlamp/grille anchors','wheel centres/stance','clean alpha edges','clean reconstruction/no photographed environment residue','no invented/warped/unsupported geometry']
    for i,c in enumerate(checks,1): d.text((45,y),f'{i:02d}. [PENDING] {c}',font=F3,fill=(218,222,226)); y+=28
    d.text((32,1150),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · cameraGeometryMatched=false · masterApproved=false · productionEligible=false',font=F3,fill=(255,190,70))
    outdir.mkdir(parents=True,exist_ok=True)
    png=outdir/'Y62-F34-V1-candidate-05-review-evidence-v01.png'; board.save(png,optimize=False)
    result={'schemaVersion':'0.26.21','pipelineId':'Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01','candidateId':EXPECTED_ID,'candidateSha256':csha,'ownerPrimaryReferenceId':'OWNER-Y62-F34-01','ownerPrimaryReferenceSha256':sha_file(OWNER),'intakeContractId':INTAKE_ID,'cameraTransferContractId':CAMERA_ID,'alphaRawSha256':alpha_sha,'machinePrecheck':{'result':'pass' if precheck else 'return','metrics':metrics,'thresholds':thresholds,'authority':'preflight-only','cameraGeometryMatched':False,'productionEligible':False},'artifact':{'file':'assets/y62-canonical-candidates/'+png.name,'sha256':sha_file(png)},'reviewDecision':{'reviewerId':None,'reviewedAt':None,'decision':'pending','cameraGeometryMatched':False,'masterApproved':False,'productionEligible':False},'rightsReady':bool(intake.get('rightsReady')),'nextGate':'identified-reviewer-semantic-and-clean-reconstruction-review'}
    js=outdir/'Y62-F34-V1-candidate-05-review-evidence-v01.json'; js.write_text(json.dumps(result,indent=2)+'\n')
    result['manifestSha256']=sha_file(js)
    text=json.dumps(result,indent=2); print(text)
    if args.json_out: Path(args.json_out).write_text(text+'\n')
    sys.exit(0 if precheck else 3)
if __name__=='__main__': main()
