#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import hashlib, json, numpy as np
ROOT=Path(__file__).resolve().parents[1]
A=ROOT/'assets/y62-canonical-candidates'
SRC=A/'Y62-F34-V1-transparent-isolation-v03.png'
ENV=A/'Y62-F34-V1-neutral-reconstruction-envelope-v01.png'
OUT=A/'Y62-F34-V1-neutral-reconstruction-v04.png'
META=A/'Y62-F34-V1-candidate-04-build.json'
EXPECTED_SRC='67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e'
EXPECTED_ENV='7ebf9e43e9a7676253f1e09307812026b13c1809d685da7954d3b31b65d8282b'
EXPECTED_OUT='bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(SRC)==EXPECTED_SRC
assert sha(ENV)==EXPECTED_ENV
assert sha(OUT)==EXPECTED_OUT
src=np.array(Image.open(SRC).convert('RGBA')); out=np.array(Image.open(OUT).convert('RGBA')); env=np.array(Image.open(ENV).convert('RGBA')).astype(np.int16)
elig=(env[:,:,1]>env[:,:,0]+50)&(env[:,:,3]>0)&(src[:,:,3]>0)
assert src.shape==out.shape==(615,1672,4)
assert int(elig.sum())==38943
assert np.array_equal(src[:,:,3],out[:,:,3])
assert np.array_equal(src[~elig,:3],out[~elig,:3])
changed=np.any(src[:,:,:3]!=out[:,:,:3],axis=2)
assert int(np.sum(changed&~elig))==0
assert int(np.sum(changed&elig))==38419
meta=json.loads(META.read_text())
assert meta['sha256']==EXPECTED_OUT
assert meta['metrics']['alphaByteIdentical'] is True
assert meta['metrics']['outsideEnvelopeRgbByteIdentical'] is True
assert meta['metrics']['changedOutsideEnvelopePixels']==0
assert meta['metrics']['changedEligiblePixels']==38419
assert meta['cameraGeometryMatched'] is False
assert meta['productionEligible'] is False
print('WF3 Y62 F34 Candidate 04 pixel-contract verifier: PASS')
