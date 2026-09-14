#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib, json, numpy as np

ROOT=Path(__file__).resolve().parents[1]
ASSET=ROOT/'assets'/'y62-canonical-candidates'
SRC=ROOT/'references'/'y62-owner'/'IMG_4540.jpeg'
OLD=ASSET/'Y62-R34-V1-transparent-isolation-v04.png'
OLD_MANIFEST=ASSET/'Y62-R34-V1-candidate-04-targeted-alpha-cleanup-v01.json'
REVIEW=ASSET/'Y62-R34-V1-candidate-04-edge-review-v01.json'
NEW=ASSET/'Y62-R34-V1-transparent-isolation-v05.png'
NEW_MASK=ASSET/'Y62-R34-V1-candidate-05-alpha-mask-v01.png'
PREVIEW=ASSET/'Y62-R34-V1-transparent-isolation-v05-preview.jpg'
BOARD=ASSET/'Y62-R34-V1-candidate-05-second-targeted-alpha-cleanup-v01.png'
MANIFEST=ASSET/'Y62-R34-V1-candidate-05-second-targeted-alpha-cleanup-v01.json'

EXPECTED_SRC='747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2'
EXPECTED_OLD='b81f9fbd476db73dc87bdabd80427eb8441ea2db2223fda8421cee51a859cc18'
EXPECTED_OLD_MANIFEST='a9e44c975f7feacabdfab8324ed390595e088001960ec1809368606ca7b4701c'
EXPECTED_REVIEW='775dd37da1e6bdfb1d288a160458c9e73f37c091e6e603cad414ade156691bd3'
CANVAS=(1672,615); SOURCE_SIZE=(700,525); PLACEMENT=(486,45)

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def font(size,bold=False):
    p='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    return ImageFont.truetype(p,size)
def checker(size,cell=18):
    out=Image.new('RGBA',size,(235,235,235,255)); d=ImageDraw.Draw(out)
    for y in range(0,size[1],cell):
        for x in range(0,size[0],cell):
            c=(246,246,246,255) if ((x//cell+y//cell)%2==0) else (100,100,100,255)
            d.rectangle((x,y,min(x+cell-1,size[0]-1),min(y+cell-1,size[1]-1)),fill=c)
    return out

def composite_on_checker(im,size):
    cp=im.copy(); cp.thumbnail(size,Image.Resampling.LANCZOS)
    layer=Image.new('RGBA',size,(0,0,0,0)); layer.alpha_composite(cp,((size[0]-cp.width)//2,(size[1]-cp.height)//2))
    return Image.alpha_composite(checker(size),layer).convert('RGB')

def binary_polygon_mask(size, polygons):
    m=Image.new('L',size,0); d=ImageDraw.Draw(m)
    for pts in polygons: d.polygon(pts,fill=255)
    return m

def main():
    for p,e,label in [(SRC,EXPECTED_SRC,'owner source'),(OLD,EXPECTED_OLD,'Candidate04'),(OLD_MANIFEST,EXPECTED_OLD_MANIFEST,'Candidate04 generation manifest'),(REVIEW,EXPECTED_REVIEW,'Candidate04 edge review')]:
        actual=sha(p)
        if actual!=e: raise SystemExit(f'{label} checksum mismatch: {actual}')
    review=json.loads(REVIEW.read_text())
    if review.get('decision')!='return-second-targeted-alpha-residue-cleanup-before-neutral-reconstruction' or not review.get('targetedCleanupAuthorised'):
        raise SystemExit('Candidate04 review does not authorise second targeted alpha cleanup')
    c=review.get('targetedCleanupConstraints',{})
    if not c.get('alphaSubtractiveOnly') or c.get('outwardSupportAdditionAllowed') or c.get('rgbRetouchAllowed') or c.get('perspectiveWarpAllowed') or c.get('nonUniformScaleAllowed') or c.get('syntheticGeometryAllowed'):
        raise SystemExit('Candidate04 cleanup authority is not fail-closed')

    old=Image.open(OLD).convert('RGBA'); old_arr=np.array(old); old_alpha=old_arr[:,:,3]

    # Second-pass cleanup uses only pixels visibly identifiable as source scene in the exact Candidate 04 review.
    # Regions are deliberately inset from uncertain vehicle boundaries; no silhouette expansion or inferred geometry is possible.
    mirror_polys=[
        # Foliage/background protrusion left/above the near-side mirror. Stops above body/fender and left of mirror housing.
        [(550,150),(578,150),(578,183),(576,183),(576,190),(578,190),(578,208),(573,208),(573,210),(550,210)],
        # Background pole/foliage above mirror, ending left of the owner-visible A-pillar edge.
        [(595,150),(621,150),(621,164),(618,164),(618,174),(615,174),(615,184),(612,184),(612,192),(609,192),(609,199),(601,199),(601,184),(595,184)],
    ]
    underbody_polys=[
        # Road/kerb + ground residue left of the owner-visible tyre edge. Boundary stays conservatively outside tyre/mudflap.
        [(620,380),(674,380),(674,390),(675,390),(675,400),(677,400),(677,410),(679,410),(679,420),(682,420),(682,430),(686,430),(686,440),(690,440),(690,450),(695,450),(695,460),(702,460),(702,475),(620,475)]
    ]
    permitted=mirror_polys+underbody_polys
    removal=np.array(binary_polygon_mask(CANVAS,permitted),dtype=np.uint8)>0
    new_alpha=old_alpha.copy()
    new_alpha[removal]=0

    if np.any(new_alpha>old_alpha): raise SystemExit('alpha increased unexpectedly')
    support_added=int(np.sum((new_alpha>0)&(old_alpha==0)))
    if support_added: raise SystemExit('outward alpha support added')
    changed=(new_alpha!=old_alpha)
    if not np.any(changed): raise SystemExit('cleanup changed no alpha pixels')
    changed_outside=int(np.sum(changed & ~removal))
    if changed_outside: raise SystemExit(f'alpha changed outside authorised zones: {changed_outside}')

    new_arr=old_arr.copy(); new_arr[:,:,3]=new_alpha
    if not np.array_equal(new_arr[:,:,:3],old_arr[:,:,:3]): raise SystemExit('RGB bytes changed')
    new=Image.fromarray(new_arr,'RGBA'); new.save(NEW,optimize=False)
    crop_alpha=Image.fromarray(new_alpha[PLACEMENT[1]:PLACEMENT[1]+SOURCE_SIZE[1],PLACEMENT[0]:PLACEMENT[0]+SOURCE_SIZE[0]],'L')
    crop_alpha.save(NEW_MASK,optimize=False)

    old_support=old_alpha>0; new_support=new_alpha>0
    removed=int(np.sum(old_support & ~new_support)); retained=int(np.sum(new_support)); alpha_changed=int(np.sum(changed))
    semi=int(np.sum((new_alpha>0)&(new_alpha<255))); opaque=int(np.sum(new_alpha==255)); transparent=int(np.sum(new_alpha==0))
    ys,xs=np.where(new_support); bbox=[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]

    # Verify retained pixels remain exact owner-source RGB after the original uniform resize/placement.
    src=Image.open(SRC).convert('RGB').resize(SOURCE_SIZE,Image.Resampling.LANCZOS); srcarr=np.array(src)
    crop=new_arr[PLACEMENT[1]:PLACEMENT[1]+SOURCE_SIZE[1],PLACEMENT[0]:PLACEMENT[0]+SOURCE_SIZE[0],:]
    retained_local=crop[:,:,3]>0
    exact=int(np.sum(np.all(crop[:,:,:3][retained_local]==srcarr[retained_local],axis=1))) if np.any(retained_local) else 0
    exact_fraction=exact/int(np.sum(retained_local)) if np.any(retained_local) else 0.0
    if exact_fraction!=1.0: raise SystemExit('retained RGB no longer matches owner source')

    Image.alpha_composite(checker(CANVAS,24),new).convert('RGB').save(PREVIEW,quality=92)

    W,H=1800,1270; out=Image.new('RGB',(W,H),(21,28,25)); d=ImageDraw.Draw(out)
    white=(239,242,239); muted=(171,184,175); green=(122,184,139); amber=(240,189,90); red=(239,116,110); line=(80,100,91)
    d.text((34,24),'Y62-R34-V1 · CANDIDATE 05 · SECOND TARGETED ALPHA CLEANUP',font=font(30,True),fill=white)
    d.text((34,66),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · OWNER RGB UNCHANGED · ALPHA-SUBTRACTIVE ONLY · NOT PRODUCTION APPROVAL',font=font(16),fill=muted)
    d.line((34,96,W-34,96),fill=line,width=2)
    out.paste(composite_on_checker(old,(820,350)),(34,125)); out.paste(composite_on_checker(new,(820,350)),(946,125))
    d.text((34,104),'BEFORE · CANDIDATE 04',font=font(14,True),fill=muted); d.text((946,104),'AFTER · CANDIDATE 05',font=font(14,True),fill=green)
    d.rectangle((34,125,854,475),outline=line,width=2); d.rectangle((946,125,1766,475),outline=line,width=2)

    zones=[('A · MIRROR / FRONT-SIDE',(545,145,635,235)),('B · WHEEL / UNDERBODY',(615,370,720,480))]
    pxs=[90,950]
    for (label,box),px in zip(zones,pxs):
        before=old.crop(box); after=new.crop(box)
        pair=Image.new('RGB',(760,350),(21,28,25)); pair.paste(composite_on_checker(before,(355,310)),(0,35)); pair.paste(composite_on_checker(after,(355,310)),(405,35))
        pd=ImageDraw.Draw(pair); pd.text((0,5),'C04',font=font(13,True),fill=muted); pd.text((405,5),'C05',font=font(13,True),fill=green)
        out.paste(pair,(px,535)); d.text((px,505),label,font=font(15,True),fill=white)

    y=925
    facts=[
      ('PASS','owner/reference authority',EXPECTED_SRC[:28]+'…'),
      ('PASS','Candidate 04 exact lineage',EXPECTED_OLD[:28]+'…'),
      ('PASS','authorising edge review',EXPECTED_REVIEW[:28]+'…'),
      ('PASS','outward alpha support',f'added {support_added} px'),
      ('PASS','second targeted subtraction',f'removed {removed:,} support px · alpha changed {alpha_changed:,} px'),
      ('PASS','retained owner RGB',f'{exact_fraction:.6f} exact across {retained:,} visible px'),
      ('PASS','RGB / perspective / geometry edit','NONE'),
      ('HOLD','edge acceptance','fresh exact-checksum Candidate 05 edge review required'),
      ('FAIL','clean neutral reconstruction','photographed body/glass reflections remain; not addressed here'),
    ]
    for status,label,val in facts:
        col=green if status=='PASS' else amber if status=='HOLD' else red
        d.text((42,y),status,font=font(14,True),fill=col); d.text((145,y),label,font=font(14,True),fill=white); d.text((515,y),val,font=font(14),fill=muted); y+=31
    d.text((42,1222),'STATE: CANDIDATE 05 CREATED · MASTER-DRAFT · CAMERA UNLOCKED · PRODUCTION INELIGIBLE · EXACT-CHECKSUM EDGE REVIEW NEXT',font=font(17,True),fill=amber)
    out.save(BOARD,optimize=False)

    candidate_sha=sha(NEW); mask_sha=sha(NEW_MASK); preview_sha=sha(PREVIEW); board_sha=sha(BOARD)
    manifest={
      'schemaVersion':'0.26.30','packageId':'Y62-R34-V1-CANDIDATE05-SECOND-TARGETED-ALPHA-CLEANUP-01','policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
      'vehicleId':'nissan-y62-warrior-2025','viewId':'rear34','briefId':'Y62-R34-V1','candidateId':'Y62-R34-V1-CANDIDATE-05',
      'source':{'id':'OWNER-Y62-REAR34-01','file':'references/y62-owner/IMG_4540.jpeg','sha256':EXPECTED_SRC,'rights':'owner-project-approved','role':'primary exact-vehicle authenticity/camera/RGB/boundary authority'},
      'lineage':{'fromCandidateId':'Y62-R34-V1-CANDIDATE-04','fromCandidateSha256':EXPECTED_OLD,'fromGenerationManifestSha256':EXPECTED_OLD_MANIFEST,'authorisingReviewId':'Y62-R34-V1-CANDIDATE04-EDGE-REVIEW-01','authorisingReviewSha256':EXPECTED_REVIEW},
      'transformation':{'kind':'second-targeted-alpha-subtractive-residue-cleanup','alphaOnly':True,'rgbChanged':False,'perspectiveWarp':False,'nonUniformScale':False,'syntheticGeometry':False,'externalProductionPixels':False,'supportExpansion':False,'authority':'exact Candidate 04 edge-review return + owner-source evidence','method':'binary zeroing only inside conservative owner-evidenced source-scene polygons; uncertain vehicle pixels retained'},
      'authorisedZones':[
        {'id':'mirror-foliage-background','basis':'unambiguous foliage/background and pole pixels left/above mirror and between mirror/A-pillar, inset from mirror housing/body/A-pillar uncertainty'},
        {'id':'wheel-underbody-road-ground','basis':'unambiguous road/kerb and ground pixels below running board and left of tyre, inset from tyre/mudflap/underbody uncertainty'}
      ],
      'metrics':{'canvas':[1672,615],'bbox':bbox,'supportAddedPixels':support_added,'supportRemovedPixelsVsCandidate04':removed,'alphaChangedPixels':alpha_changed,'changedAlphaPixelsOutsideAuthorisedZones':changed_outside,'opaquePixels':opaque,'semiTransparentPixels':semi,'transparentPixels':transparent,'nonzeroSupportPixels':retained,'retainedRgbExactFraction':exact_fraction},
      'candidate':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v05.png','sha256':candidate_sha,'width':1672,'height':615,'hasAlpha':True,'governanceState':'master-draft','cameraMatched':False,'productionEligible':False},
      'mask':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-05-alpha-mask-v01.png','sha256':mask_sha},
      'preview':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v05-preview.jpg','sha256':preview_sha},
      'board':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-05-second-targeted-alpha-cleanup-v01.png','sha256':board_sha},
      'review':{'state':'candidate05-exact-checksum-edge-review-required','edgeAccepted':False,'cleanNeutralReconstruction':'fail','f34FamilyAlignment':'hold','productionBinaryRights':'hold','masterWF5':'hold'},
      'externalExactVehiclePolicy':'reference-only unless source-specific production rights are separately recorded; no external exact-vehicle pixels were introduced',
      'nextDependency':'F34 Candidate 05 remains the first WF3 production dependency. If still absent, perform a fresh identified exact-checksum edge review of this R34 Candidate 05. Do not begin neutral/professional reconstruction until its isolation edge is accepted. Production remains blocked behind accepted F34-family alignment, production-binary rights, master approval and WF5.'
    }
    MANIFEST.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'candidateSha256':candidate_sha,'maskSha256':mask_sha,'previewSha256':preview_sha,'boardSha256':board_sha,'manifestSha256':sha(MANIFEST),'supportRemoved':removed,'supportAdded':support_added,'alphaChanged':alpha_changed,'retained':retained,'semi':semi,'bbox':bbox},indent=2))

if __name__=='__main__': main()
