#!/usr/bin/env python3
import argparse, hashlib, json, os, sys
from pathlib import Path
from PIL import Image
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
C04=ROOT/'assets/y62-canonical-candidates/Y62-F34-V1-neutral-reconstruction-v04.png'
EXPECTED=(1672,615)
C04_SHA='bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1'
CAMERA_TRANSFER_CONTRACT='Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01'
EXPECTED_ALPHA_RAW_SHA='f8c0c48381120ddb1eef0c225959955820e1f4753a3905ec96d1e87506602d05'
READY_RIGHTS={'project-owned','licensed-for-project-production'}

def sha256(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''): h.update(chunk)
    return h.hexdigest()

def main():
    ap=argparse.ArgumentParser(description='Deterministic intake validator for Y62-F34-V1-CANDIDATE-05. Never promotes production.')
    ap.add_argument('candidate')
    ap.add_argument('manifest')
    ap.add_argument('--json-out')
    args=ap.parse_args()
    cand=Path(args.candidate); manifest=Path(args.manifest)
    issues=[]; warnings=[]
    if not cand.exists(): issues.append('candidate file missing')
    if not manifest.exists(): issues.append('manifest file missing')
    meta={}
    if manifest.exists():
        try: meta=json.loads(manifest.read_text())
        except Exception as e: issues.append(f'manifest JSON invalid: {e}')
    if meta:
        if meta.get('contractId')!='Y62-F34-V1-CANDIDATE05-INTAKE-01': issues.append('wrong contractId')
        if meta.get('candidateId')!='Y62-F34-V1-CANDIDATE-05': issues.append('wrong candidateId')
        if meta.get('cameraTransferContractId')!=CAMERA_TRANSFER_CONTRACT: issues.append('wrong or missing cameraTransferContractId')
        r=meta.get('retoucher') or {}
        if not r.get('id') or not r.get('name') or not r.get('organisation'): issues.append('identified retoucher id/name/organisation required')
        if not meta.get('completedAt'): issues.append('completedAt required')
        if not meta.get('toolsAndMethod'): issues.append('toolsAndMethod required')
        sources=meta.get('productionPixelSources')
        if not isinstance(sources,list) or not sources: issues.append('productionPixelSources ledger required')
        external=meta.get('externalExactVehicleProductionSources')
        if not isinstance(external,list): issues.append('externalExactVehicleProductionSources must be an explicit array')
        else:
            for s in external:
                if not s.get('sourceId') or s.get('productionRightsState') not in READY_RIGHTS: issues.append('external exact-vehicle production source lacks production-ready rights')
        rights=meta.get('rights') or {}
        if rights.get('productionBinaryState') not in {'project-owned','licensed-for-project-production','pending','insufficient'}: issues.append('productionBinaryState not explicitly recorded')
        if not rights.get('productionBinaryBasis'): issues.append('productionBinaryBasis required')
        if not rights.get('recordedBy') or not rights.get('recordedAt'): issues.append('rights recordedBy/recordedAt required')
        decl=meta.get('declarations') or {}
        for key in ['noPerspectiveWarp','noNonUniformScaling','noCameraReframe','noReplacementWheelTyreGeometry','noInventedBodyFasciaGlassTrimAccessoryGeometry','allExternalExactVehicleProductionSourcesDeclared']:
            if decl.get(key) is not True: issues.append(f'declaration {key}=true required')
    binary={}
    if cand.exists():
        try:
            im=Image.open(cand).convert('RGBA'); arr=np.array(im)
            binary={'width':im.width,'height':im.height,'mode':'RGBA','sha256':sha256(cand)}
            if im.size!=EXPECTED: issues.append(f'candidate dimensions {im.size} != {EXPECTED}')
            if binary['sha256']==C04_SHA: issues.append('candidate binary must differ from Candidate 04')
            base=Image.open(C04).convert('RGBA'); b=np.array(base)
            if arr.shape==b.shape:
                alpha_equal=bool(np.array_equal(arr[:,:,3],b[:,:,3])); binary['alphaByteIdenticalToCandidate04']=alpha_equal
                binary['alphaRawSha256']=hashlib.sha256(arr[:,:,3].tobytes()).hexdigest()
                binary['cameraTransferContractId']=CAMERA_TRANSFER_CONTRACT
                if binary['alphaRawSha256']!=EXPECTED_ALPHA_RAW_SHA and not (meta.get('geometryException') or {}).get('preAuthorised'): issues.append('alpha raw checksum differs from locked F34 camera-transfer coordinate frame')
                if not alpha_equal and not (meta.get('geometryException') or {}).get('preAuthorised'): issues.append('alpha differs from Candidate 04 without pre-authorised geometry exception')
                rgb_changed=int(np.any(arr[:,:,:3]!=b[:,:,:3],axis=2).sum()); binary['rgbChangedPixelsVsCandidate04']=rgb_changed
                if rgb_changed==0: issues.append('Candidate 05 has no RGB pixel change versus returned Candidate 04')
                a=arr[:,:,3]>0
                binary['foregroundPixels']=int(a.sum())
                binary['canvasEdgeContact']=bool(a[0,:].any() or a[-1,:].any() or a[:,0].any() or a[:,-1].any())
                if binary['canvasEdgeContact']: warnings.append('foreground contacts canvas edge; manual review required')
            else: issues.append('candidate array shape does not match Candidate 04')
        except Exception as e: issues.append(f'candidate image invalid: {e}')
    rights=(meta.get('rights') or {}).get('productionBinaryState') if meta else None
    ext=meta.get('externalExactVehicleProductionSources') if meta else None
    rights_ready=rights in READY_RIGHTS and isinstance(ext,list) and all(s.get('productionRightsState') in READY_RIGHTS for s in ext)
    structurally_ready=not issues
    result={
      'schemaVersion':'0.26.20','contractId':'Y62-F34-V1-CANDIDATE05-INTAKE-01','candidateId':'Y62-F34-V1-CANDIDATE-05',
      'structurallyReady':structurally_ready,'rightsReady':rights_ready,'binary':binary,'issues':issues,'warnings':warnings,
      'productionEligible':False,
      'nextGate':'fresh-exact-checksum-overlay-and-identified-review' if structurally_ready else 'candidate05-intake-remediation',
      'note':'Structural intake success never constitutes master approval, camera match, clean-reconstruction PASS or production promotion.'
    }
    out=json.dumps(result,indent=2)
    print(out)
    if args.json_out: Path(args.json_out).write_text(out+'\n')
    sys.exit(0 if structurally_ready else 2)
if __name__=='__main__': main()
