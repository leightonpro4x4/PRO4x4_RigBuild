#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import hashlib, json, numpy as np

ROOT=Path(__file__).resolve().parents[1]
CAND=ROOT/'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v02.png'
BOARD=ROOT/'assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-edge-review-v01.png'
MANIFEST=ROOT/'assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-edge-review-v01.json'
EXPECTED='b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346'

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def font(size,bold=False):
    p='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    return ImageFont.truetype(p,size)
def checker(size,cell=18):
    out=Image.new('RGBA',size,(230,230,230,255)); d=ImageDraw.Draw(out)
    for y in range(0,size[1],cell):
        for x in range(0,size[0],cell):
            c=(246,246,246,255) if ((x//cell+y//cell)%2==0) else (92,92,92,255)
            d.rectangle((x,y,min(x+cell-1,size[0]-1),min(y+cell-1,size[1]-1)),fill=c)
    return out

def fit(im,box):
    x,y,w,h=box; cp=im.copy(); cp.thumbnail((w,h),Image.Resampling.LANCZOS)
    return cp,(x+(w-cp.width)//2,y+(h-cp.height)//2)

def main():
    if sha(CAND)!=EXPECTED: raise SystemExit('candidate checksum mismatch')
    im=Image.open(CAND).convert('RGBA')
    arr=np.array(im); a=arr[:,:,3]
    alpha_vals=np.unique(a).tolist(); bbox=Image.fromarray(a).getbbox()
    opaque=int(np.sum(a==255)); semi=int(np.sum((a>0)&(a<255))); trans=int(np.sum(a==0))
    if bbox is None: raise SystemExit('empty alpha')
    x0,y0,x1,y1=bbox
    # Evidence zones selected from exact candidate coordinates. They expose the binary stair-step edge,
    # retained source-scene residue near the near-side mirror, and lower bumper/tow cutout quality.
    zones=[
      ('A · MIRROR / FRONT-SIDE EDGE',(max(0,x0-18),max(0,y0+18),min(im.width,x0+220),min(im.height,y0+260))),
      ('B · ROOF / SPOILER EDGE',(max(0,x0+125),max(0,y0-18),min(im.width,x0+430),min(im.height,y0+125))),
      ('C · REAR / TAILGATE EDGE',(max(0,x1-245),max(0,y0+80),min(im.width,x1+18),min(im.height,y0+330))),
      ('D · LOWER / TOW EDGE',(max(0,x0+105),max(0,y1-185),min(im.width,x1-5),min(im.height,y1+18))),
    ]

    W,H=1800,1260
    out=Image.new('RGB',(W,H),(21,28,25)); d=ImageDraw.Draw(out)
    white=(239,242,239); muted=(171,184,175); green=(122,184,139); amber=(240,189,90); red=(239,116,110); line=(80,100,91)
    d.text((34,24),'Y62-R34-V1 · CANDIDATE 02 · EXACT-CHECKSUM EDGE REVIEW',font=font(32,True),fill=white)
    d.text((34,66),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · IDENTIFIED RETURN-ONLY QA · NO PRODUCTION PROMOTION',font=font(17),fill=muted)
    d.line((34,96,W-34,96),fill=line,width=2)

    # full candidate on checker
    full_bg=checker((960,355),18); full=Image.new('RGBA',(960,355),(0,0,0,0))
    cfit,pos=fit(im,(0,0,960,355)); full.alpha_composite(cfit,pos); full_comp=Image.alpha_composite(full_bg,full).convert('RGB')
    out.paste(full_comp,(34,116)); d.rectangle((34,116,994,471),outline=line,width=2)

    d.text((1030,120),'EXACT CANDIDATE',font=font(14,True),fill=muted)
    d.text((1030,146),'Y62-R34-V1-CANDIDATE-02',font=font(20,True),fill=white)
    d.text((1030,180),'SHA-256',font=font(13,True),fill=muted); d.text((1030,202),EXPECTED[:32]+'…',font=font(16),fill=white)
    d.text((1030,238),'ALPHA STRUCTURE',font=font(13,True),fill=muted); d.text((1030,260),f'opaque {opaque:,} · semi {semi:,} · transparent {trans:,}',font=font(16),fill=white)
    d.text((1030,294),'ALPHA VALUES',font=font(13,True),fill=muted); d.text((1030,316),str(alpha_vals),font=font(16),fill=white)
    d.text((1030,350),'REVIEWER',font=font(13,True),fill=muted); d.text((1030,372),'OPENAI-WF3-VISUAL-QA-02',font=font(16),fill=white)
    d.text((1030,406),'AUTHORITY',font=font(13,True),fill=muted); d.text((1030,428),'edge-review / return-only',font=font(16),fill=white)

    # zoom zones
    positions=[(34,510),(475,510),(916,510),(1357,510)]
    for (label,reg),(px,py) in zip(zones,positions):
        crop=im.crop(reg); bg=checker((400,330),16); fitted,pos=fit(crop,(0,0,400,330)); layer=Image.new('RGBA',(400,330),(0,0,0,0)); layer.alpha_composite(fitted,pos)
        comp=Image.alpha_composite(bg,layer).convert('RGB'); out.paste(comp,(px,py+34)); d.rectangle((px,py+34,px+400,py+364),outline=line,width=2); d.text((px,py),label,font=font(14,True),fill=white)

    y=912
    rows=[
      ('PASS','checksum / owner-camera lineage','Exact Candidate 02 SHA verified; owner-source camera and no-warp lineage remain intact.',green),
      ('PASS','no guessed geometry','Review does not repaint, warp, complete or replace any vehicle geometry.',green),
      ('RETURN','edge fidelity','Binary 0/255 alpha produces visible stair-step/clipped contouring at roof/spoiler and lower bumper/tow edges.',red),
      ('RETURN','source-scene boundary residue','Near-side mirror/front-side boundary retains visible source foliage/background residue; alpha isolation is not production-clean.',red),
      ('FAIL','clean neutral reconstruction','Photographed sky/building/foliage reflections remain in body and glass RGB; this review does not authorise removal by guessing.',red),
      ('HOLD','F34 family / rights / master / WF5','R34 production lock remains downstream of accepted F34 family alignment, production-binary rights and separate master/WF5 gates.',amber),
    ]
    for status,label,note,col in rows:
        d.text((40,y),status,font=font(15,True),fill=col); d.text((145,y),label,font=font(15,True),fill=white); d.text((465,y),note,font=font(14),fill=muted); y+=48
    d.text((40,1202),'DECISION: RETURN CANDIDATE 02 FOR ALPHA-EDGE CLEANUP BEFORE CLEAN NEUTRAL RECONSTRUCTION',font=font(20,True),fill=red)
    out.save(BOARD,optimize=False)
    board_sha=sha(BOARD)

    manifest={
      'schemaVersion':'0.26.25','packageId':'Y62-R34-V1-CANDIDATE02-EDGE-REVIEW-01','policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
      'vehicleId':'nissan-y62-warrior-2025','viewId':'rear34','briefId':'Y62-R34-V1',
      'candidate':{'candidateId':'Y62-R34-V1-CANDIDATE-02','file':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v02.png','sha256':EXPECTED,'width':im.width,'height':im.height,'hasAlpha':True,'governanceState':'master-draft','cameraMatched':False,'productionEligible':False},
      'reviewer':{'reviewerId':'OPENAI-WF3-VISUAL-QA-02','reviewerClass':'model-vision-edge-qa','authority':'edge-review-return-only','identified':True,'masterApprovalAuthority':False,'productionPassAuthority':False},
      'reviewedAt':'2026-09-14T16:05:02+09:30',
      'ownerEvidence':[{'id':'OWNER-Y62-REAR34-01','file':'references/y62-owner/IMG_4540.jpeg','sha256':'747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2','role':'primary camera/authenticity evidence'},{'id':'OWNER-Y62-REAR-01','file':'references/y62-owner/IMG_4508.jpeg','sha256':'a72cb38fc92c95afd86c6eab513904d056ae80b3123ccea64eea9cbd5c01627a','role':'rear fascia/tailgate/bumper support'},{'id':'OWNER-Y62-F34-01','file':'references/y62-owner/IMG_4030.jpeg','sha256':'400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc','role':'Warrior identity/stance/factory rolling-stock family support'}],
      'alphaEvidence':{'bbox':[x0,y0,x1,y1],'uniqueAlphaValues':alpha_vals,'opaquePixels':opaque,'semiTransparentPixels':semi,'transparentPixels':trans,'finding':'Candidate 02 uses a fully binary alpha edge (0/255 only). At the current source scale, the resulting hard contour is visibly stair-stepped/clipped in multiple high-curvature regions and is not production-clean.'},
      'checks':[
        {'id':'exact-checksum','result':'pass','basis':'candidate binary matches the checksum under review'},
        {'id':'owner-camera-lineage','result':'pass','basis':'Candidate 02 derives from accepted owner-source R34 camera with uniform resize/fixed placement and no perspective warp'},
        {'id':'no-guessed-geometry','result':'pass','basis':'review is observational only and authorises no repaint, generative completion, warp or replacement geometry'},
        {'id':'roof-spoiler-edge','result':'return','basis':'visible hard stair-step/clipped contour on roof/spoiler edge at candidate scale'},
        {'id':'mirror-front-side-boundary','result':'return','basis':'visible source-scene foliage/background residue remains adjacent to the near-side mirror/front-side boundary'},
        {'id':'lower-bumper-tow-edge','result':'return','basis':'hard binary contour and clipped soft edge/detail remain around lower bumper/tow region'},
        {'id':'clean-neutral-reconstruction','result':'fail','basis':'photographed environment reflections remain in body/glass RGB; edge cleanup alone will not satisfy neutral reconstruction'},
        {'id':'f34-family-alignment','result':'hold','basis':'accepted F34 canonical master remains pending Candidate 05'},
        {'id':'production-binary-rights','result':'hold','basis':'not separately recorded'},
        {'id':'master-wf5','result':'hold','basis':'separate master approval and WF5 exact-checksum promotion gate not run'}
      ],
      'decision':'return-edge-cleanup-before-neutral-reconstruction','edgeQuality':'return','reconstructionAllowed':True,'cameraReviewAccepted':True,'cameraGeometryMatched':False,'productionEligible':False,
      'board':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-edge-review-v01.png','sha256':board_sha},
      'externalExactVehiclePolicy':'reference-only unless separately rights-recorded; no external exact-vehicle production pixels were introduced by Candidate 02 or this review',
      'nextDependency':'F34 Candidate 05 remains first. For R34, create a checksum-new alpha-edge-cleaned Candidate 03 from the owner-source pixels only (no RGB repaint, perspective warp or synthetic geometry), then perform fresh exact-checksum edge review before any clean neutral/professional reconstruction. Production lock remains blocked behind accepted F34-family alignment, production-binary rights, master approval and WF5.'
    }
    MANIFEST.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'boardSha256':board_sha,'manifestSha256':sha(MANIFEST),'alphaValues':alpha_vals,'bbox':bbox,'opaque':opaque,'semi':semi},indent=2))

if __name__=='__main__': main()
