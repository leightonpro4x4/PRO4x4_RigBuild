#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib, json, numpy as np, cv2

ROOT=Path(__file__).resolve().parents[1]
ASSET=ROOT/'assets'/'y62-canonical-candidates'
SRC=ROOT/'references'/'y62-owner'/'IMG_4540.jpeg'
OLD_MASK=ASSET/'Y62-R34-V1-candidate-02-alpha-mask-v01.png'
OLD_CAND=ASSET/'Y62-R34-V1-transparent-isolation-v02.png'
NEW_MASK=ASSET/'Y62-R34-V1-candidate-03-alpha-mask-v01.png'
OUT=ASSET/'Y62-R34-V1-transparent-isolation-v03.png'
PREVIEW=ASSET/'Y62-R34-V1-transparent-isolation-v03-preview.jpg'
BOARD=ASSET/'Y62-R34-V1-candidate-03-alpha-edge-cleanup-v01.png'
MANIFEST=ASSET/'Y62-R34-V1-candidate-03-alpha-edge-cleanup-v01.json'

EXPECTED_SRC='747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2'
EXPECTED_OLD_MASK='33571a82c811f6ad2d4d1a338f1bdaf0ffe92aafa91f8164b3cc00665c173859'
EXPECTED_OLD_CAND='b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346'
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

def main():
    for p,expected,label in [(SRC,EXPECTED_SRC,'owner source'),(OLD_MASK,EXPECTED_OLD_MASK,'Candidate02 mask'),(OLD_CAND,EXPECTED_OLD_CAND,'Candidate02')]:
        if sha(p)!=expected: raise SystemExit(f'{label} checksum mismatch')

    old_mask=np.array(Image.open(OLD_MASK).convert('L'))
    binary=(old_mask>0).astype(np.uint8)
    # Candidate 03 is alpha-only edge anti-aliasing. Support is constrained to Candidate 02 exactly:
    # no previously transparent pixel may become visible, so no new silhouette/geometry is created.
    dist=cv2.distanceTransform(binary,cv2.DIST_L2,5)
    new_alpha=np.where(binary>0,np.clip(np.rint((dist/1.8)*255.0),1,255),0).astype(np.uint8)
    # Preserve deep interior fully opaque and ensure exact nonzero support equivalence.
    new_alpha[dist>=1.8]=255
    if not np.array_equal(new_alpha>0,binary>0): raise SystemExit('alpha support changed')
    Image.fromarray(new_alpha,'L').save(NEW_MASK,optimize=False)

    source=Image.open(SRC).convert('RGB').resize(SOURCE_SIZE,Image.Resampling.LANCZOS)
    rgba=source.convert('RGBA'); rgba.putalpha(Image.fromarray(new_alpha,'L'))
    canvas=Image.new('RGBA',CANVAS,(0,0,0,0)); canvas.alpha_composite(rgba,PLACEMENT)
    canvas.save(OUT,optimize=False)

    old_canvas=Image.open(OLD_CAND).convert('RGBA')
    old_a=np.array(old_canvas.getchannel('A')); new_a=np.array(canvas.getchannel('A'))
    old_support=old_a>0; new_support=new_a>0
    changed_alpha=int(np.sum(old_a!=new_a)); semi=int(np.sum((new_a>0)&(new_a<255))); opaque=int(np.sum(new_a==255)); transparent=int(np.sum(new_a==0))
    support_added=int(np.sum(new_support & ~old_support)); support_removed=int(np.sum(old_support & ~new_support))
    alpha_abs_diff=np.abs(new_a.astype(np.int16)-old_a.astype(np.int16))
    max_alpha_delta=int(alpha_abs_diff.max()); mean_changed_delta=float(alpha_abs_diff[old_a!=new_a].mean()) if changed_alpha else 0.0

    # Visible RGB must remain exact owner-source RGB for every retained pixel.
    crop=canvas.crop((PLACEMENT[0],PLACEMENT[1],PLACEMENT[0]+SOURCE_SIZE[0],PLACEMENT[1]+SOURCE_SIZE[1]))
    crop_rgb=np.array(crop.convert('RGB')); src_rgb=np.array(source); crop_a=np.array(crop.getchannel('A'))
    retained=crop_a>0
    rgb_exact=int(np.sum(np.all(crop_rgb[retained]==src_rgb[retained],axis=1))) if np.any(retained) else 0
    retained_count=int(np.sum(retained)); rgb_fraction=(rgb_exact/retained_count) if retained_count else 0

    # Preview.
    preview=Image.alpha_composite(checker(CANVAS,24),canvas).convert('RGB'); preview.save(PREVIEW,quality=92)

    # Evidence board. This is generation evidence, not semantic approval.
    W,H=1800,1220; out=Image.new('RGB',(W,H),(21,28,25)); d=ImageDraw.Draw(out)
    white=(239,242,239); muted=(171,184,175); green=(122,184,139); amber=(240,189,90); line=(80,100,91)
    d.text((34,24),'Y62-R34-V1 · CANDIDATE 03 · ALPHA-EDGE CLEANUP',font=font(32,True),fill=white)
    d.text((34,66),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · OWNER-SOURCE RGB ONLY · GENERATION EVIDENCE · NOT PRODUCTION APPROVAL',font=font(16),fill=muted)
    d.line((34,96,W-34,96),fill=line,width=2)
    old_comp=composite_on_checker(old_canvas,(820,360)); new_comp=composite_on_checker(canvas,(820,360))
    out.paste(old_comp,(34,128)); out.paste(new_comp,(946,128))
    d.text((34,106),'BEFORE · CANDIDATE 02 · BINARY 0/255 ALPHA',font=font(15,True),fill=muted)
    d.text((946,106),'AFTER · CANDIDATE 03 · INWARD ANTIALIAS, SAME SUPPORT',font=font(15,True),fill=green)
    d.rectangle((34,128,854,488),outline=line,width=2); d.rectangle((946,128,1766,488),outline=line,width=2)

    # Exact candidate edge zones from canvas coordinates.
    bbox=canvas.getchannel('A').getbbox(); x0,y0,x1,y1=bbox
    zones=[('A · MIRROR / FRONT-SIDE',(max(0,x0-15),max(0,y0+15),min(CANVAS[0],x0+230),min(CANVAS[1],y0+265))),
           ('B · ROOF / SPOILER',(max(0,x0+120),max(0,y0-15),min(CANVAS[0],x0+440),min(CANVAS[1],y0+135))),
           ('C · LOWER / TOW',(max(0,x0+95),max(0,y1-195),min(CANVAS[0],x1+10),min(CANVAS[1],y1+15)))]
    pxs=[34,622,1210]
    for (label,reg),px in zip(zones,pxs):
        oldcrop=old_canvas.crop(reg); newcrop=canvas.crop(reg)
        pair=Image.new('RGB',(540,290),(21,28,25))
        pair.paste(composite_on_checker(oldcrop,(260,260)),(0,30)); pair.paste(composite_on_checker(newcrop,(260,260)),(280,30))
        pd=ImageDraw.Draw(pair); pd.text((0,2),'C02',font=font(13,True),fill=muted); pd.text((280,2),'C03',font=font(13,True),fill=green)
        out.paste(pair,(px,540)); d.text((px,514),label,font=font(14,True),fill=white)

    y=870
    facts=[('PASS','owner source checksum',EXPECTED_SRC[:28]+'…'),
           ('PASS','Candidate 02 lineage',EXPECTED_OLD_CAND[:28]+'…'),
           ('PASS','no outward alpha support',f'added {support_added} px · removed {support_removed} px'),
           ('PASS','retained RGB identity',f'{rgb_fraction:.6f} exact across {retained_count:,} visible pixels'),
           ('PASS','perspective / RGB / geometry edits','NONE'),
           ('INFO','alpha cleanup',f'{changed_alpha:,} alpha bytes changed · {semi:,} semi-transparent px · max delta {max_alpha_delta}'),
           ('HOLD','semantic edge quality','fresh exact-checksum identified edge review required'),
           ('FAIL','clean neutral reconstruction','photographed reflections/environment remain; not addressed here')]
    for status,label,val in facts:
        col=green if status=='PASS' else amber if status in ('HOLD','INFO') else (235,118,110)
        d.text((42,y),status,font=font(14,True),fill=col); d.text((145,y),label,font=font(14,True),fill=white); d.text((500,y),val,font=font(14),fill=muted); y+=38
    d.text((42,1176),'STATE: CHECKSUM-NEW CANDIDATE 03 CREATED · MASTER-DRAFT · NO CAMERA LOCK · NO PRODUCTION PROMOTION',font=font(18,True),fill=amber)
    out.save(BOARD,optimize=False)

    manifest={
      'schemaVersion':'0.26.26','packageId':'Y62-R34-V1-CANDIDATE03-ALPHA-EDGE-CLEANUP-01','policy':'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
      'vehicleId':'nissan-y62-warrior-2025','viewId':'rear34','briefId':'Y62-R34-V1','candidateId':'Y62-R34-V1-CANDIDATE-03',
      'source':{'id':'OWNER-Y62-REAR34-01','file':'references/y62-owner/IMG_4540.jpeg','sha256':EXPECTED_SRC,'rights':'owner-project-approved','role':'primary authenticity + direct camera/RGB source'},
      'lineage':{'fromCandidateId':'Y62-R34-V1-CANDIDATE-02','fromCandidateSha256':EXPECTED_OLD_CAND,'fromMaskSha256':EXPECTED_OLD_MASK,'edgeReviewPackageId':'Y62-R34-V1-CANDIDATE02-EDGE-REVIEW-01','returnedReason':'binary stair-step/clipping + boundary residue; this package addresses alpha antialias only'},
      'transformation':{'type':'alpha-only-inward-antialias','sourceResize':{'width':700,'height':525,'method':'LANCZOS-uniform-4:3'},'placement':{'x':486,'y':45},'canvas':{'width':1672,'height':615},'method':{'distanceTransform':'OpenCV DIST_L2 mask support','featherDistancePx':1.8,'constraint':'new alpha > 0 iff Candidate 02 alpha > 0'},'perspectiveWarp':False,'crop':False,'nonUniformScale':False,'syntheticGeometry':False,'rgbRetouch':False,'outwardSilhouetteExpansion':False},
      'candidate':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v03.png','sha256':sha(OUT),'mimeType':'image/png','width':1672,'height':615,'hasAlpha':True,'preview':'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v03-preview.jpg','previewSha256':sha(PREVIEW),'governanceState':'master-draft','cameraMatched':False,'productionEligible':False},
      'mask':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-alpha-mask-v01.png','sha256':sha(NEW_MASK),'width':700,'height':525},
      'verification':{'ownerSourceSha256Verified':True,'candidate02Sha256Verified':True,'candidate02MaskSha256Verified':True,'retainedRgbExactFraction':rgb_fraction,'retainedPixels':retained_count,'alphaSupportAddedPixels':support_added,'alphaSupportRemovedPixels':support_removed,'alphaSupportByteIdentical':bool(np.array_equal(new_support,old_support)),'alphaChangedPixels':changed_alpha,'semiTransparentPixels':semi,'opaquePixels':opaque,'transparentPixels':transparent,'maxAlphaDelta':max_alpha_delta,'meanChangedAlphaDelta':round(mean_changed_delta,4),'perspectiveWarp':False,'syntheticGeometry':False,'externalProductionPixels':False},
      'review':{'state':'candidate03-edge-review-required','generationChecks':[{'id':'exact-owner-source-lineage','result':'pass'},{'id':'same-alpha-support-as-candidate02','result':'pass'},{'id':'retained-rgb-exact','result':'pass'},{'id':'no-guessed-geometry','result':'pass'},{'id':'camera-preservation','result':'pass'},{'id':'edge-quality','result':'hold','basis':'must be judged against this exact Candidate 03 checksum; generation metrics are not semantic approval'},{'id':'source-scene-boundary-residue','result':'hold','basis':'alpha antialiasing does not claim removal of all source-scene residue'},{'id':'clean-neutral-reconstruction','result':'fail','basis':'photographed reflections/environment remain in body/glass RGB and were intentionally not repainted'}],'decision':'review-candidate03-exact-checksum-before-neutral-reconstruction','cameraGeometryMatched':False,'productionEligible':False},
      'board':{'file':'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-alpha-edge-cleanup-v01.png','sha256':sha(BOARD)},
      'externalExactVehiclePolicy':'reference-only unless separately rights-recorded; no external exact-vehicle production pixels introduced',
      'prohibitedUse':['customer resolver','production master','production camera lock','accessory compositing source'],
      'nextDependency':'F34 Candidate 05 remains first. For R34, perform fresh identified exact-checksum edge review of Candidate 03. Do not begin clean neutral/professional reconstruction until Candidate 03 edge quality is reviewed; production lock remains blocked behind F34-family alignment, production-binary rights, master approval and WF5.'
    }
    MANIFEST.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'candidateSha256':sha(OUT),'maskSha256':sha(NEW_MASK),'previewSha256':sha(PREVIEW),'boardSha256':sha(BOARD),'manifestSha256':sha(MANIFEST),'alphaChangedPixels':changed_alpha,'semiTransparentPixels':semi,'supportAdded':support_added,'supportRemoved':support_removed,'retainedRgbExactFraction':rgb_fraction},indent=2))

if __name__=='__main__': main()
