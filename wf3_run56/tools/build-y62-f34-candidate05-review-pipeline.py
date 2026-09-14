#!/usr/bin/env python3
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
ROOT=Path(__file__).resolve().parents[1]
OUTJ=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-review-pipeline-v01.json'
OUTP=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-review-pipeline-v01.png'

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def font(size,b=False):
 ps=['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if b else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if b else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']
 for p in ps:
  if Path(p).exists(): return ImageFont.truetype(p,size)
 return ImageFont.load_default()

data={
 'schemaVersion':'0.26.21','pipelineId':'Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01','policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY','candidateId':'Y62-F34-V1-CANDIDATE-05','state':'READY_WAITING_CANDIDATE05','candidateReceived':False,
 'inputs':{'intakeContractId':'Y62-F34-V1-CANDIDATE05-INTAKE-01','cameraTransferContractId':'Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01','handoffId':'Y62-F34-V1-PRO-RECON-HANDOFF-01','primaryOwnerReferenceId':'OWNER-Y62-F34-01','primaryOwnerReferenceSha256':'400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc','expectedAlphaRawSha256':'f8c0c48381120ddb1eef0c225959955820e1f4753a3905ec96d1e87506602d05','canvas':[1672,615]},
 'execution':['deterministic Candidate 05 intake structurallyReady=true','pin exact new Candidate 05 SHA-256','verify locked alpha/camera coordinate frame','generate fresh OWNER-Y62-F34-01 registration/overlay evidence','bind supporting owner references to checksum-specific semantic packet','identified reviewer completes mandatory camera/geometry/clean-reconstruction checks','rights gate remains separate','master/WF5 promotion remains separate'],
 'machineAuthority':'preflight-only','cameraGeometryMatched':False,'masterApproved':False,'productionEligible':False,
 'nextDependency':'Candidate 05 binary + completed intake manifest. No review evidence can be inherited from Candidate 04.'
}
OUTJ.parent.mkdir(parents=True,exist_ok=True); OUTJ.write_text(json.dumps(data,indent=2)+'\n')
board=Image.new('RGB',(1800,1050),(27,30,34));d=ImageDraw.Draw(board);F1,F2,F3=font(34,True),font(22,True),font(18,False)
d.text((32,26),'PRO4X4 RIG BUILDER — F34 CANDIDATE 05 REVIEW PIPELINE',font=F1,fill=(245,245,245));d.text((32,72),'READY / WAITING FOR CANDIDATE 05 · no inherited approval · no guessed geometry',font=F2,fill=(255,190,70))
steps=[('01','INTAKE PASS','Y62-F34-V1-CANDIDATE05-INTAKE-01 must return structurallyReady=true.'),('02','EXACT CHECKSUM','Pin the returned Candidate 05 binary. Candidate 04 evidence cannot transfer.'),('03','CAMERA / ALPHA LOCK','Validate 1672×615 RGBA + camera-transfer alpha checksum.'),('04','OWNER OVERLAY','Generate fresh owner F34 registration/overlay against the exact Candidate 05 checksum.'),('05','SEMANTIC PACK','Bind F34/F34-support/front owner references to mandatory reviewer checks.'),('06','IDENTIFIED REVIEW','Camera, silhouette, Warrior wheels/stance, fascia, edges, clean reconstruction, no invented geometry.'),('07','RIGHTS GATE','Production-binary rights stay separate; external exact-vehicle production sources require source rights.'),('08','MASTER + WF5','Only exact-checksum master approval + WF5 may promote production.')]
y=135
for n,title,txt in steps:
 d.rounded_rectangle((38,y,1760,y+92),radius=14,outline=(95,102,110),width=2); d.text((58,y+18),n,font=F2,fill=(255,190,70)); d.text((118,y+14),title,font=F2,fill=(242,242,242)); d.text((118,y+50),txt,font=F3,fill=(210,214,218)); y+=105
d.text((32,990),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · owner Series 5 Warrior pack remains primary authenticity evidence · productionEligible=false',font=F3,fill=(255,190,70));board.save(OUTP,optimize=False)
print(json.dumps({'manifest':str(OUTJ.relative_to(ROOT)),'manifestSha256':sha(OUTJ),'board':str(OUTP.relative_to(ROOT)),'boardSha256':sha(OUTP)},indent=2))
