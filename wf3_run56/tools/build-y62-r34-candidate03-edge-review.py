#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import hashlib, json, numpy as np

ROOT=Path(__file__).resolve().parents[1]
CAND=ROOT/'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v03.png'
BOARD=ROOT/'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-edge-review-v01.png'
MANIFEST=ROOT/'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-edge-review-v01.json'
EXPECTED='1260362df7d22c70dafbfd3deba3f767150496093fdaeb8178b826e0470fd6b7'
OWNER_SHA='747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2'


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

def solid_comp(cand,crop,bg=(255,255,255,255),size=(400,300)):
    c=cand.crop(crop); base=Image.new('RGBA',c.size,bg); comp=Image.alpha_composite(base,c).convert('RGB')
    comp.thumbnail(size,Image.Resampling.LANCZOS)
    panel=Image.new('RGB',size,(255,255,255)); panel.paste(comp,((size[0]-comp.width)//2,(size[1]-comp.height)//2))
    return panel

def checker_comp(cand,crop,size=(400,300)):
    c=cand.crop(crop); bg=checker(c.size,12); comp=Image.alpha_composite(bg,c).convert('RGB'); comp.thumbnail(size,Image.Resampling.LANCZOS)
    panel=Image.new('RGB',size,(32,36,34)); panel.paste(comp,((size[0]-comp.width)//2,(size[1]-comp.height)//2))
    return panel

def main():
    if sha(CAND)!=EXPECTED: raise SystemExit('candidate checksum mismatch')
    im=Image.open(CAND).convert('RGBA')
    a=np.array(im.getchannel('A'))
    vals=np.unique(a).tolist(); bbox=im.getchannel('A').getbbox()
    if bbox is None: raise SystemExit('empty alpha')
    x0,y0,x1,y1=bbox
    opaque=int(np.sum(a==255)); semi=int(np.sum((a>0)&(a<255))); trans=int(np.sum(a==0))
    support=int(np.sum(a>0))
    if vals != [0,142,198,255]: raise SystemExit(f'unexpected alpha levels: {vals}')

    # Exact candidate-space evidence zones chosen after visual inspection against owner R34 source.
    zones={
      'mirror':(545,145,705,305),
      'roof':(615,95,1045,225),
      'lower':(590,310,1055,505),
      'tow':(890,315,1055,500),
    }

    W,H=1800,1320
    out=Image.new('RGB',(W,H),(21,28,25)); d=ImageDraw.Draw(out)
    white=(239,242,239); muted=(171,184,175); green=(122,184,139); amber=(240,189,90); red=(239,116,110); line=(80,100,91)
    d.text((34,24),'Y62-R34-V1 · CANDIDATE 03 · EXACT-CHECKSUM EDGE REVIEW',font=font(32,True),fill=white)
    d.text((34,66),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · OWNER EVIDENCE PRIMARY · REVIEW/RETURN AUTHORITY ONLY',font=font(17),fill=muted)
    d.line((34,96,W-34,96),fill=line,width=2)

    # Full candidate on checker.
    full_bg=checker((960,355),18); layer=Image.new('RGBA',(960,355),(0,0,0,0)); cfit,pos=fit(im,(0,0,960,355)); layer.alpha_composite(cfit,pos)
    out.paste(Image.alpha_composite(full_bg,layer).convert('RGB'),(34,116)); d.rectangle((34,116,994,471),outline=line,width=2)
    d.text((1030,120),'EXACT CANDIDATE',font=font(14,True),fill=muted)
    d.text((1030,146),'Y62-R34-V1-CANDIDATE-03',font=font(20,True),fill=white)
    d.text((1030,180),'SHA-256',font=font(13,True),fill=muted); d.text((1030,202),EXPECTED[:32]+'…',font=font(16),fill=white)
    d.text((1030,238),'ALPHA STRUCTURE',font=font(13,True),fill=muted); d.text((1030,260),f'opaque {opaque:,} · semi {semi:,} · transparent {trans:,}',font=font(16),fill=white)
    d.text((1030,294),'SUPPORT / LEVELS',font=font(13,True),fill=muted); d.text((1030,316),f'{support:,} nonzero px · {vals}',font=font(16),fill=white)
    d.text((1030,350),'REVIEWER',font=font(13,True),fill=muted); d.text((1030,372),'OPENAI-WF3-VISUAL-QA-03',font=font(16),fill=white)
    d.text((1030,406),'AUTHORITY',font=font(13,True),fill=muted); d.text((1030,428),'edge QA / return-or-authorise-cleanup',font=font(16),fill=white)

    # Evidence crops: white exposes retained photographed background; checker confirms edge/alpha behaviour.
    panels=[
      ('A · MIRROR / FRONT-SIDE · WHITE',solid_comp(im,zones['mirror'])),
      ('B · ROOF / SPOILER · WHITE',solid_comp(im,zones['roof'])),
      ('C · WHEEL / UNDERBODY · WHITE',solid_comp(im,zones['lower'])),
      ('D · TOW / LOWER BUMPER · CHECKER',checker_comp(im,zones['tow'])),
    ]
    positions=[(34,510),(475,510),(916,510),(1357,510)]
    for (label,panel),(px,py) in zip(panels,positions):
        out.paste(panel,(px,py+34)); d.rectangle((px,py+34,px+400,py+334),outline=line,width=2); d.text((px,py),label,font=font(14,True),fill=white)

    y=888
    rows=[
      ('PASS','checksum / owner-camera lineage','Exact Candidate 03 checksum verified; accepted owner R34 camera, no warp and no synthetic geometry remain intact.',green),
      ('PASS','anti-alias improvement','1,901 boundary pixels are now semi-transparent while nonzero silhouette support remains unchanged.',green),
      ('PASS','roof / spoiler contour','Roof and spoiler boundary is materially smoother and no unsupported outward geometry is introduced.',green),
      ('RETURN','mirror / front-side residue','Owner-source foliage/background remains visibly inside the alpha support immediately behind/around the near-side mirror.',red),
      ('RETURN','wheel / underbody residue','A material photographed road/ground patch remains attached below the running-board/rear-wheel region; hard residual cut is visible.',red),
      ('PASS','tow / lower-bumper edge','Tow/lower-bumper contour is reviewable after antialiasing; no separate geometry addition is required at this stage.',green),
      ('FAIL','clean neutral reconstruction','Photographed reflections/environment remain inside body/glass RGB; this package does not repaint or infer replacement surfaces.',red),
      ('HOLD','F34 family / rights / master / WF5','Production lock remains downstream of F34 Candidate 05, production-binary rights, master approval and WF5.',amber),
    ]
    for status,label,note,col in rows:
        d.text((40,y),status,font=font(14,True),fill=col); d.text((145,y),label,font=font(14,True),fill=white); d.text((455,y),note,font=font(13),fill=muted); y+=45
    d.text((40,1260),'DECISION: RETURN CANDIDATE 03 FOR TARGETED ALPHA-SUBTRACTIVE SOURCE-RESIDUE CLEANUP · NO RGB/GEOMETRY EDIT',font=font(18,True),fill=red)
    out.save(BOARD,optimize=False)
    board_sha=sha(BOARD)

    manifest={
      'schemaVersion':'0.26.27','packageId':'Y62-R34-V1-CANDIDATE03-EDGE-REVIEW-01','policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
      'vehicleId':'nissan-y62-warrior-2025','viewId':'rear34','briefId':'Y62-R34-V1',
      'candidate':{'candidateId':'Y62-R34-V1-CANDIDATE-03','file':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v03.png','sha256':EXPECTED,'width':im.width,'height':im.height,'hasAlpha':True,'governanceState':'master-draft','cameraMatched':False,'productionEligible':False},
      'reviewer':{'reviewerId':'OPENAI-WF3-VISUAL-QA-03','reviewerClass':'model-vision-edge-qa','authority':'edge-review-return-and-alpha-cleanup-authorisation-only','identified':True,'masterApprovalAuthority':False,'productionPassAuthority':False},
      'reviewedAt':'2026-09-14T17:58:54+09:30',
      'ownerEvidence':[
        {'id':'OWNER-Y62-REAR34-01','file':'references/y62-owner/IMG_4540.jpeg','sha256':OWNER_SHA,'role':'primary exact-vehicle R34 camera, silhouette and boundary authenticity evidence'},
        {'id':'OWNER-Y62-REAR-01','file':'references/y62-owner/IMG_4508.jpeg','sha256':'a72cb38fc92c95afd86c6eab513904d056ae80b3123ccea64eea9cbd5c01627a','role':'rear fascia/tailgate/bumper support'},
        {'id':'OWNER-Y62-F34-01','file':'references/y62-owner/IMG_4030.jpeg','sha256':'400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc','role':'Warrior identity/stance/factory rolling-stock family support'}
      ],
      'alphaEvidence':{'bbox':[x0,y0,x1,y1],'uniqueAlphaValues':vals,'opaquePixels':opaque,'semiTransparentPixels':semi,'transparentPixels':trans,'nonzeroSupportPixels':support,'candidate02SupportPreserved':True,'supportAddedPixelsVsCandidate02':0,'supportRemovedPixelsVsCandidate02':0,'finding':'Candidate 03 materially fixes the fully-binary edge by adding inward antialiasing, but the unchanged Candidate 02 support also preserves photographed background residue in two clearly evidenced regions.'},
      'checks':[
        {'id':'exact-checksum','result':'pass','basis':'Candidate 03 binary matches the checksum under review'},
        {'id':'owner-camera-lineage','result':'pass','basis':'accepted owner-source R34 camera retained; no perspective warp/non-uniform scale/synthetic completion'},
        {'id':'no-guessed-geometry','result':'pass','basis':'review is observational; proposed next cleanup is alpha-subtractive only and may remove only owner-evidenced source-scene residue'},
        {'id':'antialias-improvement','result':'pass','basis':'1,901 semi-transparent boundary pixels replace hard binary edge bytes without outward support'},
        {'id':'roof-spoiler-edge','result':'pass','basis':'boundary materially smoother; no visible unsupported outward silhouette in reviewed zone'},
        {'id':'mirror-front-side-boundary','result':'return','basis':'visible owner-photo foliage/background patch remains inside alpha immediately behind/around near-side mirror'},
        {'id':'wheel-underbody-boundary','result':'return','basis':'visible road/ground patch remains attached beneath running-board/rear-wheel region, including a hard residual cut'},
        {'id':'lower-bumper-tow-edge','result':'pass','basis':'edge is reviewable after inward antialiasing and does not require geometry addition at this stage'},
        {'id':'clean-neutral-reconstruction','result':'fail','basis':'photographed environment reflections remain in body/glass RGB; this edge review does not authorise guessed repainting'},
        {'id':'f34-family-alignment','result':'hold','basis':'accepted F34 canonical master remains pending Candidate 05'},
        {'id':'production-binary-rights','result':'hold','basis':'not separately recorded'},
        {'id':'master-wf5','result':'hold','basis':'separate master approval and WF5 exact-checksum promotion gate not run'}
      ],
      'decision':'return-targeted-alpha-residue-cleanup-before-neutral-reconstruction','edgeQuality':'return-targeted-cleanup','targetedCleanupAuthorised':True,'targetedCleanupConstraints':{'alphaSubtractiveOnly':True,'outwardSupportAdditionAllowed':False,'rgbRetouchAllowed':False,'perspectiveWarpAllowed':False,'nonUniformScaleAllowed':False,'syntheticGeometryAllowed':False,'permittedRegions':['near-side mirror/front-side photographed background residue','running-board/rear-wheel underbody photographed road/ground residue'],'authority':'owner-source evidence only; do not remove uncertain vehicle pixels'},
      'reconstructionAllowed':False,'cameraReviewAccepted':True,'cameraGeometryMatched':False,'productionEligible':False,
      'board':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-edge-review-v01.png','sha256':board_sha},
      'externalExactVehiclePolicy':'reference-only unless separately rights-recorded; no external exact-vehicle production pixels were introduced by Candidate 03 or this review',
      'nextDependency':'F34 Candidate 05 remains first. If still unavailable, create checksum-new Y62-R34-V1-CANDIDATE-04 by alpha-subtractive cleanup only in the two owner-evidenced residue zones; do not add alpha support, repaint RGB, warp perspective or invent geometry. Then perform a fresh exact-checksum edge review before any clean neutral/professional reconstruction. Production remains blocked behind accepted F34-family alignment, production-binary rights, master approval and WF5.'
    }
    MANIFEST.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'boardSha256':board_sha,'manifestSha256':sha(MANIFEST),'candidateSha256':EXPECTED,'alphaValues':vals,'bbox':bbox,'opaque':opaque,'semi':semi,'support':support},indent=2))

if __name__=='__main__': main()
