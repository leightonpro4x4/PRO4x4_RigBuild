#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib, json, numpy as np

ROOT=Path(__file__).resolve().parents[1]
ASSET=ROOT/'assets'/'y62-canonical-candidates'
SRC=ROOT/'references'/'y62-owner'/'IMG_4540.jpeg'
OLD=ASSET/'Y62-R34-V1-transparent-isolation-v03.png'
OLD_MASK=ASSET/'Y62-R34-V1-candidate-03-alpha-mask-v01.png'
REVIEW=ASSET/'Y62-R34-V1-candidate-03-edge-review-v01.json'
NEW=ASSET/'Y62-R34-V1-transparent-isolation-v04.png'
NEW_MASK=ASSET/'Y62-R34-V1-candidate-04-alpha-mask-v01.png'
PREVIEW=ASSET/'Y62-R34-V1-transparent-isolation-v04-preview.jpg'
BOARD=ASSET/'Y62-R34-V1-candidate-04-targeted-alpha-cleanup-v01.png'
MANIFEST=ASSET/'Y62-R34-V1-candidate-04-targeted-alpha-cleanup-v01.json'

EXPECTED_SRC='747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2'
EXPECTED_OLD='1260362df7d22c70dafbfd3deba3f767150496093fdaeb8178b826e0470fd6b7'
EXPECTED_OLD_MASK='c0d66588f0dbba6300383f7beffaf10524d93d6814aa7cb967a4324b708e0041'
EXPECTED_REVIEW='caf4cd3bb1d1ff050bdecd178dfd8a99d593676c8846466b45bdf873e58d8e7c'
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

def aa_polygon_mask(size, polygons, scale=4):
    big=Image.new('L',(size[0]*scale,size[1]*scale),0); d=ImageDraw.Draw(big)
    for pts in polygons:
        d.polygon([(x*scale,y*scale) for x,y in pts],fill=255)
    return big.resize(size,Image.Resampling.LANCZOS)

def main():
    for p,e,label in [(SRC,EXPECTED_SRC,'owner source'),(OLD,EXPECTED_OLD,'Candidate03'),(OLD_MASK,EXPECTED_OLD_MASK,'Candidate03 mask'),(REVIEW,EXPECTED_REVIEW,'Candidate03 edge review')]:
        if sha(p)!=e: raise SystemExit(f'{label} checksum mismatch: {sha(p)}')
    review=json.loads(REVIEW.read_text())
    if review.get('decision')!='return-targeted-alpha-residue-cleanup-before-neutral-reconstruction' or not review.get('targetedCleanupAuthorised'):
        raise SystemExit('Candidate03 review does not authorise targeted alpha cleanup')

    old=Image.open(OLD).convert('RGBA'); old_arr=np.array(old); old_alpha=old_arr[:,:,3]
    # Cleanup coordinates are expressed on the canonical 1672x615 canvas and are deliberately conservative.
    # Only clearly photographed background/ground inside the two review-authorised zones is subtracted.
    mirror_polys=[
        [(568,188),(581,188),(581,211),(568,211)],       # foliage left of mirror housing
        [(598,164),(614,164),(614,194),(598,194)],       # foliage/background between mirror and A-pillar
    ]
    underbody_polys=[
        [(644,369),(655,370),(664,375),(669,382),(672,392),(673,404),(674,417),
         (677,432),(681,444),(686,452),(689,456),(685,459),(679,460),(672,456),
         (665,450),(659,440),(655,428),(653,414),(652,400),(653,386),(650,377),(644,372)]
    ]
    permitted=mirror_polys+underbody_polys
    removal=np.array(aa_polygon_mask(CANVAS,permitted,scale=4),dtype=np.uint16)
    # Alpha-subtractive only. Multiplication can only lower alpha; it can never create support.
    new_alpha=np.rint(old_alpha.astype(np.float64)*(1.0-removal.astype(np.float64)/255.0)).astype(np.uint8)
    # Remove tiny detached remnants created only by anti-aliased subtraction inside the authorised raster.
    import cv2
    n,lab,stats,_=cv2.connectedComponentsWithStats((new_alpha>0).astype(np.uint8),8)
    for cid in range(1,n):
        if int(stats[cid,cv2.CC_STAT_AREA])<=4:
            pix=(lab==cid)
            if np.all(removal[pix]>0): new_alpha[pix]=0
    if np.any(new_alpha>old_alpha): raise SystemExit('alpha increased unexpectedly')
    support_added=int(np.sum((new_alpha>0)&(old_alpha==0)))
    if support_added: raise SystemExit('outward alpha support added')
    changed=(new_alpha!=old_alpha)
    if not np.any(changed): raise SystemExit('cleanup changed no alpha pixels')

    new_arr=old_arr.copy(); new_arr[:,:,3]=new_alpha
    new=Image.fromarray(new_arr,'RGBA'); new.save(NEW,optimize=False)
    # source-space alpha mask remains useful for deterministic downstream review.
    crop_alpha=Image.fromarray(new_alpha[PLACEMENT[1]:PLACEMENT[1]+SOURCE_SIZE[1],PLACEMENT[0]:PLACEMENT[0]+SOURCE_SIZE[0]],'L')
    crop_alpha.save(NEW_MASK,optimize=False)

    # Verify RGB byte identity for every pixel, and quantify exact support subtraction.
    if not np.array_equal(new_arr[:,:,:3],old_arr[:,:,:3]): raise SystemExit('RGB bytes changed')
    old_support=old_alpha>0; new_support=new_alpha>0
    removed=int(np.sum(old_support & ~new_support)); retained=int(np.sum(new_support)); alpha_changed=int(np.sum(changed))
    semi=int(np.sum((new_alpha>0)&(new_alpha<255))); opaque=int(np.sum(new_alpha==255)); transparent=int(np.sum(new_alpha==0))
    # Ensure every changed alpha pixel lies inside the exact authorised raster mask.
    changed_outside=int(np.sum(changed & (removal==0)))
    if changed_outside: raise SystemExit(f'alpha changed outside authorised zones: {changed_outside}')

    # Owner-source visible RGB identity: candidate03 already pins owner RGB; verify retained RGB still matches uniformly resized source.
    src=Image.open(SRC).convert('RGB').resize(SOURCE_SIZE,Image.Resampling.LANCZOS)
    srcarr=np.array(src)
    crop=new_arr[PLACEMENT[1]:PLACEMENT[1]+SOURCE_SIZE[1],PLACEMENT[0]:PLACEMENT[0]+SOURCE_SIZE[0],:]
    retained_local=crop[:,:,3]>0
    exact=int(np.sum(np.all(crop[:,:,:3][retained_local]==srcarr[retained_local],axis=1))) if np.any(retained_local) else 0
    exact_fraction=exact/int(np.sum(retained_local)) if np.any(retained_local) else 0.0
    if exact_fraction!=1.0: raise SystemExit('retained RGB no longer matches owner source')

    Image.alpha_composite(checker(CANVAS,24),new).convert('RGB').save(PREVIEW,quality=92)

    # Evidence board: generation evidence only, never semantic/master approval.
    W,H=1800,1260; out=Image.new('RGB',(W,H),(21,28,25)); d=ImageDraw.Draw(out)
    white=(239,242,239); muted=(171,184,175); green=(122,184,139); amber=(240,189,90); red=(239,116,110); line=(80,100,91)
    d.text((34,24),'Y62-R34-V1 · CANDIDATE 04 · TARGETED ALPHA RESIDUE CLEANUP',font=font(30,True),fill=white)
    d.text((34,66),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · OWNER-SOURCE RGB UNCHANGED · ALPHA-SUBTRACTIVE ONLY · NOT PRODUCTION APPROVAL',font=font(16),fill=muted)
    d.line((34,96,W-34,96),fill=line,width=2)
    out.paste(composite_on_checker(old,(820,350)),(34,125)); out.paste(composite_on_checker(new,(820,350)),(946,125))
    d.text((34,104),'BEFORE · CANDIDATE 03',font=font(14,True),fill=muted); d.text((946,104),'AFTER · CANDIDATE 04',font=font(14,True),fill=green)
    d.rectangle((34,125,854,475),outline=line,width=2); d.rectangle((946,125,1766,475),outline=line,width=2)

    zones=[('A · MIRROR / FRONT-SIDE',(555,150,630,225)),('B · WHEEL / UNDERBODY',(635,355,725,470))]
    pxs=[90,950]
    for (label,box),px in zip(zones,pxs):
        before=old.crop(box); after=new.crop(box)
        pair=Image.new('RGB',(760,350),(21,28,25)); pair.paste(composite_on_checker(before,(355,310)),(0,35)); pair.paste(composite_on_checker(after,(355,310)),(405,35))
        pd=ImageDraw.Draw(pair); pd.text((0,5),'C03',font=font(13,True),fill=muted); pd.text((405,5),'C04',font=font(13,True),fill=green)
        out.paste(pair,(px,535)); d.text((px,505),label,font=font(15,True),fill=white)

    y=930
    facts=[
      ('PASS','owner/reference authority',EXPECTED_SRC[:28]+'…'),
      ('PASS','Candidate 03 exact lineage',EXPECTED_OLD[:28]+'…'),
      ('PASS','authorising edge review',EXPECTED_REVIEW[:28]+'…'),
      ('PASS','outward alpha support',f'added {support_added} px'),
      ('PASS','targeted support subtraction',f'removed {removed:,} px · alpha changed {alpha_changed:,} px'),
      ('PASS','retained owner RGB',f'{exact_fraction:.6f} exact across {retained:,} visible px'),
      ('PASS','RGB / perspective / geometry edit','NONE'),
      ('HOLD','edge acceptance','fresh exact-checksum Candidate 04 edge review required'),
      ('FAIL','clean neutral reconstruction','photographed body/glass reflections remain; not addressed here'),
    ]
    for status,label,val in facts:
        col=green if status=='PASS' else amber if status=='HOLD' else red
        d.text((42,y),status,font=font(14,True),fill=col); d.text((145,y),label,font=font(14,True),fill=white); d.text((515,y),val,font=font(14),fill=muted); y+=31
    d.text((42,1215),'STATE: CANDIDATE 04 CREATED · MASTER-DRAFT · CAMERA UNLOCKED · PRODUCTION INELIGIBLE · EXACT-CHECKSUM EDGE REVIEW NEXT',font=font(17,True),fill=amber)
    out.save(BOARD,optimize=False)

    manifest={
      'schemaVersion':'0.26.28','packageId':'Y62-R34-V1-CANDIDATE04-TARGETED-ALPHA-CLEANUP-01','policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
      'vehicleId':'nissan-y62-warrior-2025','viewId':'rear34','briefId':'Y62-R34-V1','candidateId':'Y62-R34-V1-CANDIDATE-04',
      'source':{'id':'OWNER-Y62-REAR34-01','file':'references/y62-owner/IMG_4540.jpeg','sha256':EXPECTED_SRC,'rights':'owner-project-approved','role':'primary exact-vehicle authenticity/camera/RGB authority'},
      'lineage':{'fromCandidateId':'Y62-R34-V1-CANDIDATE-03','fromCandidateSha256':EXPECTED_OLD,'fromMaskSha256':EXPECTED_OLD_MASK,'authorisingReviewPackageId':'Y62-R34-V1-CANDIDATE03-EDGE-REVIEW-01','authorisingReviewSha256':EXPECTED_REVIEW,'authorisedDecision':'return-targeted-alpha-residue-cleanup-before-neutral-reconstruction'},
      'transformation':{'type':'alpha-only-targeted-subtraction','canvas':{'width':1672,'height':615},'sourceResize':{'width':700,'height':525,'method':'LANCZOS-uniform-4:3'},'placement':{'x':486,'y':45},'permittedZones':[{'id':'mirror-front-side','reason':'owner-evidenced photographed foliage/background residue','polygons':mirror_polys},{'id':'wheel-underbody','reason':'owner-evidenced photographed road/ground residue','polygons':underbody_polys}], 'method':'4x supersampled polygon subtraction multiplied into Candidate 03 alpha; RGB bytes preserved exactly','alphaSubtractiveOnly':True,'outwardSupportAddition':False,'rgbRetouch':False,'perspectiveWarp':False,'nonUniformScale':False,'syntheticGeometry':False,'externalProductionPixels':False},
      'candidate':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v04.png','sha256':sha(NEW),'preview':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v04-preview.jpg','previewSha256':sha(PREVIEW),'mimeType':'image/png','width':1672,'height':615,'hasAlpha':True,'governanceState':'master-draft','cameraMatched':False,'productionEligible':False},
      'mask':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-04-alpha-mask-v01.png','sha256':sha(NEW_MASK),'width':700,'height':525},
      'verification':{'ownerSourceSha256Verified':True,'candidate03Sha256Verified':True,'authorisingReviewSha256Verified':True,'rgbBytesChanged':0,'retainedRgbExactFraction':exact_fraction,'retainedVisiblePixels':retained,'alphaSupportAddedPixels':support_added,'alphaSupportRemovedPixels':removed,'alphaChangedPixels':alpha_changed,'changedAlphaPixelsOutsideAuthorisedZones':changed_outside,'opaquePixels':opaque,'semiTransparentPixels':semi,'transparentPixels':transparent,'perspectiveWarp':False,'syntheticGeometry':False,'externalProductionPixels':False},
      'review':{'state':'candidate04-exact-checksum-edge-review-required','edgeQuality':'hold','cleanNeutralReconstruction':'fail','f34FamilyAlignment':'hold','productionRights':'hold','masterApproval':'hold','wf5Promotion':'hold','cameraMatched':False,'productionEligible':False},
      'board':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-04-targeted-alpha-cleanup-v01.png','sha256':sha(BOARD)},
      'externalExactVehiclePolicy':'External exact-vehicle images/3D remain reference-only unless source-specific production rights are separately recorded. Candidate 04 uses owner-source RGB only and introduces no external production pixels.',
      'nextDependency':'F34 Candidate 05 remains first. If still unavailable, perform a fresh identified exact-checksum edge review of Y62-R34-V1-CANDIDATE-04. Do not begin clean neutral/professional reconstruction until that review passes the targeted residue boundaries. Production remains blocked behind F34-family alignment, production-binary rights, master approval and WF5.'
    }
    MANIFEST.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'candidateSha256':sha(NEW),'maskSha256':sha(NEW_MASK),'previewSha256':sha(PREVIEW),'boardSha256':sha(BOARD),'manifestSha256':sha(MANIFEST),'supportAdded':support_added,'supportRemoved':removed,'alphaChanged':alpha_changed,'semiTransparent':semi,'retainedVisiblePixels':retained,'rgbExactFraction':exact_fraction},indent=2))

if __name__=='__main__': main()
