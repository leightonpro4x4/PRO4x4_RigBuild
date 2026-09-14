#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import hashlib, json, numpy as np

ROOT=Path(__file__).resolve().parents[1]
ASSET=ROOT/'assets'/'y62-canonical-candidates'
CAND=ASSET/'Y62-R34-V1-transparent-isolation-v04.png'
C04_MANIFEST=ASSET/'Y62-R34-V1-candidate-04-targeted-alpha-cleanup-v01.json'
C03_REVIEW=ASSET/'Y62-R34-V1-candidate-03-edge-review-v01.json'
OWNER=ROOT/'references'/'y62-owner'/'IMG_4540.jpeg'
BOARD=ASSET/'Y62-R34-V1-candidate-04-edge-review-v01.png'
MANIFEST=ASSET/'Y62-R34-V1-candidate-04-edge-review-v01.json'
EXPECTED='b81f9fbd476db73dc87bdabd80427eb8441ea2db2223fda8421cee51a859cc18'
EXPECTED_C04_MANIFEST='a9e44c975f7feacabdfab8324ed390595e088001960ec1809368606ca7b4701c'
EXPECTED_C03_REVIEW='caf4cd3bb1d1ff050bdecd178dfd8a99d593676c8846466b45bdf873e58d8e7c'
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

def comp(cand,crop,size=(390,290),white=False):
    c=cand.crop(crop)
    bg=Image.new('RGBA',c.size,(255,255,255,255)) if white else checker(c.size,10)
    v=Image.alpha_composite(bg,c).convert('RGB'); v.thumbnail(size,Image.Resampling.NEAREST)
    panel=Image.new('RGB',size,(255,255,255) if white else (32,36,34))
    panel.paste(v,((size[0]-v.width)//2,(size[1]-v.height)//2))
    return panel

def main():
    for p,e,label in [(CAND,EXPECTED,'Candidate04'),(C04_MANIFEST,EXPECTED_C04_MANIFEST,'Candidate04 generation manifest'),(C03_REVIEW,EXPECTED_C03_REVIEW,'Candidate03 authorising review'),(OWNER,OWNER_SHA,'owner source')]:
        if sha(p)!=e: raise SystemExit(f'{label} checksum mismatch: {sha(p)}')
    c04m=json.loads(C04_MANIFEST.read_text())
    if c04m.get('candidateId')!='Y62-R34-V1-CANDIDATE-04': raise SystemExit('Candidate04 generation manifest mismatch')
    if c04m.get('verification',{}).get('alphaSupportAddedPixels')!=0: raise SystemExit('Candidate04 added unsupported alpha support')
    if c04m.get('verification',{}).get('retainedRgbExactFraction')!=1: raise SystemExit('Candidate04 retained RGB is not exact owner source')

    im=Image.open(CAND).convert('RGBA'); a=np.array(im.getchannel('A')); vals=np.unique(a).tolist(); bbox=im.getchannel('A').getbbox()
    if bbox is None: raise SystemExit('empty alpha')
    x0,y0,x1,y1=bbox
    opaque=int(np.sum(a==255)); semi=int(np.sum((a>0)&(a<255))); trans=int(np.sum(a==0)); support=int(np.sum(a>0))

    # Candidate-space review windows. These are observation windows, not edit masks.
    zones={
      'mirror':(540,140,720,320),
      'roof':(610,90,1060,230),
      'underbody':(610,330,760,500),
      'tow':(880,300,1080,520),
    }

    W,H=1800,1340
    out=Image.new('RGB',(W,H),(21,28,25)); d=ImageDraw.Draw(out)
    white=(239,242,239); muted=(171,184,175); green=(122,184,139); amber=(240,189,90); red=(239,116,110); line=(80,100,91)
    d.text((34,24),'Y62-R34-V1 · CANDIDATE 04 · EXACT-CHECKSUM EDGE REVIEW',font=font(32,True),fill=white)
    d.text((34,66),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · OWNER EVIDENCE PRIMARY · REVIEW/RETURN AUTHORITY ONLY',font=font(17),fill=muted)
    d.line((34,96,W-34,96),fill=line,width=2)

    full_bg=checker((960,355),18); layer=Image.new('RGBA',(960,355),(0,0,0,0)); cfit,pos=fit(im,(0,0,960,355)); layer.alpha_composite(cfit,pos)
    out.paste(Image.alpha_composite(full_bg,layer).convert('RGB'),(34,116)); d.rectangle((34,116,994,471),outline=line,width=2)
    d.text((1030,120),'EXACT CANDIDATE',font=font(14,True),fill=muted)
    d.text((1030,146),'Y62-R34-V1-CANDIDATE-04',font=font(20,True),fill=white)
    d.text((1030,180),'SHA-256',font=font(13,True),fill=muted); d.text((1030,202),EXPECTED[:32]+'…',font=font(16),fill=white)
    d.text((1030,238),'ALPHA STRUCTURE',font=font(13,True),fill=muted); d.text((1030,260),f'opaque {opaque:,} · semi {semi:,} · transparent {trans:,}',font=font(16),fill=white)
    d.text((1030,294),'SUPPORT / BBOX',font=font(13,True),fill=muted); d.text((1030,316),f'{support:,} nonzero px · {bbox}',font=font(16),fill=white)
    d.text((1030,350),'C03 → C04 CLEANUP',font=font(13,True),fill=muted); d.text((1030,372),'1,880 support px removed · 0 added',font=font(16),fill=green)
    d.text((1030,406),'REVIEWER / AUTHORITY',font=font(13,True),fill=muted); d.text((1030,428),'OPENAI-WF3-VISUAL-QA-04 · edge return only',font=font(16),fill=white)

    panels=[
      ('A · MIRROR / FRONT-SIDE · WHITE',comp(im,zones['mirror'],white=True)),
      ('B · ROOF / SPOILER · CHECKER',comp(im,zones['roof'],white=False)),
      ('C · WHEEL / UNDERBODY · WHITE',comp(im,zones['underbody'],white=True)),
      ('D · TOW / LOWER BUMPER · CHECKER',comp(im,zones['tow'],white=False)),
    ]
    positions=[(34,510),(475,510),(916,510),(1357,510)]
    for (label,panel),(px,py) in zip(panels,positions):
        out.paste(panel,(px,py+34)); d.rectangle((px,py+34,px+390,py+324),outline=line,width=2); d.text((px,py),label,font=font(14,True),fill=white)

    y=868
    rows=[
      ('PASS','checksum / owner-camera lineage','Exact Candidate 04 checksum and owner-source lineage verified; accepted R34 camera remains unwarped.',green),
      ('PASS','authorised C03 → C04 subtraction','Generation manifest verifies 1,880 support px removed, 0 added; retained RGB stays 100% owner-source exact.',green),
      ('PASS','roof / spoiler + tow contours','Previously accepted roof/spoiler and lower-bumper/tow contours remain reviewable; cleanup did not touch them.',green),
      ('RETURN','mirror residual remains','A distinct photographed foliage/background spike remains above/behind the near-side mirror; it is not vehicle geometry.',red),
      ('RETURN','underbody ground residual remains','A detached curved road/kerb remnant remains below/left of the rear wheel plus source-ground residue below the running board.',red),
      ('FAIL','clean neutral reconstruction','Photographed environment/reflections remain inside retained body/glass RGB; no RGB repaint is authorised by this review.',red),
      ('HOLD','F34 family / rights / master / WF5','Production remains downstream of F34 Candidate 05, production-binary rights, master approval and WF5.',amber),
    ]
    for status,label,note,col in rows:
        d.text((40,y),status,font=font(14,True),fill=col); d.text((145,y),label,font=font(14,True),fill=white); d.text((455,y),note,font=font(13),fill=muted); y+=50
    d.text((40,1260),'DECISION: RETURN CANDIDATE 04 FOR SECOND TARGETED ALPHA-SUBTRACTIVE RESIDUE CLEANUP · CAMERA/GEOMETRY STILL ACCEPTED',font=font(18,True),fill=red)
    d.text((40,1295),'NEXT R34 EDIT AUTHORITY: ONLY UNAMBIGUOUS MIRROR-FOLIAGE + UNDERBODY ROAD/KERB RESIDUE; NO OUTWARD SUPPORT, RGB RETOUCH OR SYNTHETIC GEOMETRY',font=font(14,True),fill=amber)
    out.save(BOARD,optimize=False)
    board_sha=sha(BOARD)

    manifest={
      'schemaVersion':'0.26.29','packageId':'Y62-R34-V1-CANDIDATE04-EDGE-REVIEW-01','policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
      'vehicleId':'nissan-y62-warrior-2025','viewId':'rear34','briefId':'Y62-R34-V1',
      'candidate':{'candidateId':'Y62-R34-V1-CANDIDATE-04','file':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v04.png','sha256':EXPECTED,'width':im.width,'height':im.height,'hasAlpha':True,'governanceState':'master-draft','cameraMatched':False,'productionEligible':False},
      'reviewer':{'reviewerId':'OPENAI-WF3-VISUAL-QA-04','reviewerClass':'model-vision-edge-qa','authority':'edge-review-return-and-second-targeted-alpha-cleanup-authorisation-only','identified':True,'masterApprovalAuthority':False,'productionPassAuthority':False},
      'reviewedAt':'2026-09-14T19:58:45+09:30',
      'ownerEvidence':[
        {'id':'OWNER-Y62-REAR34-01','file':'references/y62-owner/IMG_4540.jpeg','sha256':OWNER_SHA,'role':'primary exact-vehicle R34 camera, silhouette, RGB and boundary-authenticity evidence'},
        {'id':'OWNER-Y62-REAR-01','file':'references/y62-owner/IMG_4508.jpeg','sha256':'a72cb38fc92c95afd86c6eab513904d056ae80b3123ccea64eea9cbd5c01627a','role':'rear fascia/tailgate/bumper support'},
        {'id':'OWNER-Y62-F34-01','file':'references/y62-owner/IMG_4030.jpeg','sha256':'400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc','role':'Warrior identity/stance/factory rolling-stock family support'}
      ],
      'lineage':{'generationPackageId':'Y62-R34-V1-CANDIDATE04-TARGETED-ALPHA-CLEANUP-01','generationManifest':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-04-targeted-alpha-cleanup-v01.json','generationManifestSha256':EXPECTED_C04_MANIFEST,'authorisingPriorReviewId':'Y62-R34-V1-CANDIDATE03-EDGE-REVIEW-01','authorisingPriorReviewSha256':EXPECTED_C03_REVIEW},
      'alphaEvidence':{'bbox':[x0,y0,x1,y1],'uniqueAlphaValueCount':len(vals),'opaquePixels':opaque,'semiTransparentPixels':semi,'transparentPixels':trans,'nonzeroSupportPixels':support,'supportAddedPixelsVsCandidate03':0,'supportRemovedPixelsVsCandidate03':1880,'retainedRgbExactFraction':1.0,'finding':'Candidate 04 preserves the accepted camera and materially subtracts the first two residue masks without adding silhouette support, but exact-checksum review still shows two unambiguous source-scene remnants inside alpha.'},
      'checks':[
        {'id':'exact-checksum','result':'pass','basis':'Candidate 04 binary matches exact checksum under review'},
        {'id':'owner-camera-lineage','result':'pass','basis':'accepted direct owner R34 camera retained; no perspective warp, non-uniform scale or synthetic completion'},
        {'id':'candidate03-review-authority','result':'pass','basis':'Candidate 04 generation is pinned to the prior exact-checksum return manifest'},
        {'id':'outward-alpha-support','result':'pass','basis':'Candidate 04 generation added 0 previous-transparent support pixels'},
        {'id':'retained-owner-rgb','result':'pass','basis':'all retained visible RGB remains exact to uniformly resized owner source'},
        {'id':'roof-spoiler-edge','result':'pass','basis':'previously accepted contour remains reviewable and outside the targeted cleanup'},
        {'id':'mirror-front-side-boundary','result':'return','basis':'photographed foliage/background spike remains above/behind near-side mirror and is visibly non-vehicle source scene'},
        {'id':'wheel-underbody-boundary','result':'return','basis':'detached curved road/kerb remnant remains below/left of rear wheel and ground residue remains below running-board zone'},
        {'id':'lower-bumper-tow-edge','result':'pass','basis':'previously accepted tow/lower-bumper contour remains intact and is not part of the return'},
        {'id':'clean-neutral-reconstruction','result':'fail','basis':'photographed environment/reflections remain inside body/glass RGB; this review does not authorise repaint or inferred surfaces'},
        {'id':'f34-family-alignment','result':'hold','basis':'accepted F34 canonical family alignment remains prerequisite for R34 production lock'},
        {'id':'production-binary-rights','result':'hold','basis':'separate production-binary rights record remains absent'},
        {'id':'master-wf5','result':'hold','basis':'master approval and WF5 exact-checksum promotion have not occurred'}
      ],
      'decision':'return-second-targeted-alpha-residue-cleanup-before-neutral-reconstruction','edgeQuality':'return-targeted-cleanup','targetedCleanupAuthorised':True,
      'targetedCleanupConstraints':{'alphaSubtractiveOnly':True,'outwardSupportAdditionAllowed':False,'rgbRetouchAllowed':False,'perspectiveWarpAllowed':False,'nonUniformScaleAllowed':False,'syntheticGeometryAllowed':False,'permittedRegions':['unambiguous photographed foliage/background spike immediately above/behind the near-side mirror; exclude mirror housing, A-pillar and uncertain vehicle pixels','unambiguous detached photographed road/kerb remnant below/left of rear wheel and source-ground residue below running board; exclude tyre, mudflap, running board and uncertain underbody pixels'],'authority':'owner-source evidence only; remove only pixels that are clearly source scene and retain uncertain vehicle pixels'},
      'reconstructionAllowed':False,'cameraReviewAccepted':True,'cameraGeometryMatched':False,'productionEligible':False,
      'board':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-04-edge-review-v01.png','sha256':board_sha},
      'externalExactVehiclePolicy':'reference-only unless separately rights-recorded; no external exact-vehicle production pixels were introduced by Candidate 04 or this review',
      'nextDependency':'F34 Candidate 05 remains first. If still unavailable, create checksum-new Y62-R34-V1-CANDIDATE-05 using alpha-subtractive cleanup only for the two residual owner-evidenced source-scene areas authorised by this exact-checksum review. Do not add alpha support, repaint RGB, warp perspective, rescale non-uniformly or invent geometry. Then perform another fresh exact-checksum edge review before clean neutral/professional reconstruction. Production remains blocked behind accepted F34-family alignment, production-binary rights, master approval and WF5.'
    }
    MANIFEST.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'boardSha256':board_sha,'manifestSha256':sha(MANIFEST),'candidateSha256':EXPECTED,'alphaValueCount':len(vals),'bbox':bbox,'opaque':opaque,'semi':semi,'support':support},indent=2))

if __name__=='__main__': main()
