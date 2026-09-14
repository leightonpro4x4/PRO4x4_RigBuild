#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import cv2
import hashlib
import json
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
CANDIDATE = ROOT / 'assets/y62-canonical-candidates/Y62-F34-V1-transparent-isolation-v03.png'
OUT_DIR = ROOT / 'assets/y62-canonical-candidates'
MASK_OUT = OUT_DIR / 'Y62-F34-V1-neutral-reconstruction-envelope-v01.png'
BOARD_OUT = OUT_DIR / 'Y62-F34-V1-neutral-reconstruction-map-v01.png'
JSON_OUT = OUT_DIR / 'Y62-F34-V1-neutral-reconstruction-map-v01.json'

EXPECTED_CANDIDATE_SHA = '67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e'
EDGE_BUFFER_PX = 18
EDGE_DILATE_PX = 7
LOWER_GEOMETRY_LOCK_Y = 430  # lock wheels/underbody/lower bumper region on canonical canvas
FRONT_FASCIA_LOCK = (930, 190, 1260, 480)  # conservative grille/headlamp/bumper anchor block


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def font(size=26, bold=False):
    names = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'
    ]
    for n in names:
        if Path(n).exists():
            return ImageFont.truetype(n, size=size)
    return ImageFont.load_default()


def fit(im: Image.Image, box):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    cp = im.copy()
    cp.thumbnail((w, h), Image.Resampling.LANCZOS)
    x = x0 + (w - cp.width) // 2
    y = y0 + (h - cp.height) // 2
    return cp, (x, y)


def main():
    if sha256(CANDIDATE) != EXPECTED_CANDIDATE_SHA:
        raise SystemExit('Candidate checksum mismatch; refusing to build retouch contract against a different binary.')

    rgba = np.array(Image.open(CANDIDATE).convert('RGBA'))
    rgb = rgba[:, :, :3]
    alpha = rgba[:, :, 3]
    fg = (alpha > 0).astype(np.uint8)
    h, w = fg.shape
    if (w, h) != (1672, 615):
        raise SystemExit(f'Unexpected candidate dimensions {w}x{h}')

    # Distance from silhouette boundary: anything within EDGE_BUFFER_PX is geometry-locked.
    dist = cv2.distanceTransform(fg, cv2.DIST_L2, 5)
    silhouette_lock = ((fg > 0) & (dist < EDGE_BUFFER_PX)).astype(np.uint8)

    # Lock image-detail edges (trim, lamp/grille boundaries, badges, body creases, wheel detail).
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    canny = cv2.Canny(gray, 55, 145)
    canny[fg == 0] = 0
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (EDGE_DILATE_PX, EDGE_DILATE_PX))
    detail_lock = (cv2.dilate(canny, kernel, iterations=1) > 0).astype(np.uint8)

    # Additional conservative locks for high-risk geometry regions. These are review guards, not image edits.
    semantic_lock = np.zeros_like(fg)
    semantic_lock[LOWER_GEOMETRY_LOCK_Y:, :] = fg[LOWER_GEOMETRY_LOCK_Y:, :]
    x0, y0, x1, y1 = FRONT_FASCIA_LOCK
    semantic_lock[y0:y1, x0:x1] = fg[y0:y1, x0:x1]

    lock = ((silhouette_lock | detail_lock | semantic_lock) & fg).astype(np.uint8)
    envelope = ((fg > 0) & (lock == 0)).astype(np.uint8)

    # Guarantee no editable pixel is close to the alpha boundary.
    if np.any((envelope > 0) & (dist < EDGE_BUFFER_PX)):
        raise SystemExit('Unsafe envelope touches silhouette buffer')

    # RGBA mask: green = eligible interior review envelope, red = locked geometry/detail, transparent = outside vehicle.
    mask_rgba = np.zeros((h, w, 4), dtype=np.uint8)
    mask_rgba[lock > 0] = [220, 54, 54, 210]
    mask_rgba[envelope > 0] = [40, 190, 110, 175]
    Image.fromarray(mask_rgba, 'RGBA').save(MASK_OUT, optimize=True)

    # Evidence board.
    W, H = 1672, 1120
    board = Image.new('RGB', (W, H), (20, 23, 26))
    d = ImageDraw.Draw(board)
    white = (244, 246, 247); muted = (173, 181, 187); line = (73, 81, 87)
    green = (70, 215, 140); red = (236, 83, 83); amber = (245, 187, 75)
    d.text((36, 26), 'PRO4X4 RIG BUILDER · WF3', fill=white, font=font(34, True))
    d.text((36, 72), 'Y62-F34-V1 · NEUTRAL RECONSTRUCTION RETOUCH CONTRACT', fill=white, font=font(30, True))
    d.text((36, 112), 'Candidate 03 checksum-pinned · geometry locked · RGB-only neutralisation envelope', fill=muted, font=font(21))

    cand = Image.open(CANDIDATE).convert('RGBA')
    checker = Image.new('RGB', (w, h), (235, 235, 235))
    cd = ImageDraw.Draw(checker)
    sq = 28
    for yy in range(0, h, sq):
        for xx in range(0, w, sq):
            if ((xx // sq) + (yy // sq)) % 2:
                cd.rectangle([xx, yy, min(xx+sq-1,w-1), min(yy+sq-1,h-1)], fill=(210,210,210))
    checker.paste(cand, (0,0), cand)
    overlay = checker.convert('RGBA')
    overlay.alpha_composite(Image.open(MASK_OUT).convert('RGBA'))

    box1=(36,160,818,450); box2=(854,160,1636,450)
    for box,title in [(box1,'A · Candidate 03 — unchanged'),(box2,'B · Retouch envelope / geometry locks')]:
        d.rounded_rectangle(box, radius=12, outline=line, width=2, fill=(29,33,37))
        d.text((box[0]+18,box[1]+12),title,fill=white,font=font(20,True))
    img,pos=fit(checker,(box1[0]+12,box1[1]+48,box1[2]-12,box1[3]-12)); board.paste(img,pos)
    img,pos=fit(overlay.convert('RGB'),(box2[0]+12,box2[1]+48,box2[2]-12,box2[3]-12)); board.paste(img,pos)

    # Contract panel
    y=480
    d.rounded_rectangle((36,y,1636,1045), radius=12, outline=line, width=2, fill=(29,33,37))
    d.text((60,y+24),'RETOUCH RULES — NO GEOMETRY RECONSTRUCTION BY GUESS',fill=white,font=font(25,True))
    rules=[
        ('LOCKED', 'Alpha/silhouette, wheel centres, tyre/wheel shape, roofline, mirrors, snorkel, lamps, grille, fascia, badges, handles, body creases and lower geometry may not move or be repainted into a new shape.'),
        ('ELIGIBLE', 'Only RGB appearance inside the green interior envelope may be neutralised, and only to remove source-scene reflections/lighting dependence. The envelope is permissive, not mandatory.'),
        ('SOURCE', 'Identity and geometry remain anchored to OWNER-Y62-F34-01/02 and OWNER-Y62-FRONT-01/02. No external exact-vehicle image may contribute production pixels without separately recorded rights.'),
        ('VERIFY', 'Any reconstructed candidate must preserve the 1672×615 canvas, exact alpha mask unless an identified reviewer explicitly approves an edge fix, pass the locked overlay contract, and be checksum-pinned before review.'),
        ('PROMOTE', 'This contract does not approve Candidate 03 or any future retouch. master-approved + identified reviewer + production rights + WF5 exact-checksum gate remain mandatory.')
    ]
    yy=y+76
    for tag,txt in rules:
        tag_color = red if tag=='LOCKED' else green if tag=='ELIGIBLE' else amber
        d.rounded_rectangle((60,yy,164,yy+38),radius=7,fill=tag_color)
        d.text((73,yy+7),tag,fill=(15,15,15),font=font(17,True))
        # word wrap
        words=txt.split(); lines=[]; cur=''
        maxw=1370
        f=font(18)
        for word in words:
            test=(cur+' '+word).strip()
            if d.textlength(test,font=f)>maxw and cur:
                lines.append(cur);cur=word
            else: cur=test
        if cur: lines.append(cur)
        for i,line_txt in enumerate(lines[:3]):
            d.text((184,yy+4+i*23),line_txt,fill=white,font=f)
        yy += max(62, 12+23*len(lines))

    d.text((60,1011), f'Envelope pixels: {int(envelope.sum()):,} · Locked foreground pixels: {int(lock.sum()):,} · Foreground total: {int(fg.sum()):,}', fill=muted, font=font(17))
    d.text((36,1080),'REFERENCE_BACKED_APPROVED_VISUALS_ONLY · REVIEW / RETOUCH CONTRACT ONLY · NOT CUSTOMER PRODUCTION', fill=amber, font=font(18,True))
    board.save(BOARD_OUT, optimize=True)

    evidence = {
        'schemaVersion':'0.26.9',
        'contractId':'Y62-F34-V1-NEUTRAL-RECONSTRUCTION-01',
        'candidateId':'Y62-F34-V1-CANDIDATE-03',
        'candidateSha256':EXPECTED_CANDIDATE_SHA,
        'purpose':'Conservative RGB-only neutralisation/retouch envelope for a future F34 reconstruction candidate. This artifact does not modify or approve Candidate 03.',
        'referenceIds':['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02'],
        'externalExactVehicleProductionSourcesUsed':False,
        'algorithm':{
            'alphaBoundaryBufferPx':EDGE_BUFFER_PX,
            'detailEdgeDetector':'Canny 55/145',
            'detailLockDilationPx':EDGE_DILATE_PX,
            'lowerGeometryLockFromCanvasY':LOWER_GEOMETRY_LOCK_Y,
            'frontFasciaLockRect':list(FRONT_FASCIA_LOCK),
            'rule':'eligible envelope = opaque candidate pixels minus silhouette buffer, dilated image-detail edges and conservative high-risk geometry locks'
        },
        'metrics':{
            'foregroundPixels':int(fg.sum()),
            'lockedForegroundPixels':int(lock.sum()),
            'eligibleInteriorPixels':int(envelope.sum()),
            'eligiblePctOfForeground':round(float(envelope.sum()/max(1,fg.sum())*100),4),
            'envelopeTouchesSilhouetteBuffer':False
        },
        'immutableRules':{
            'alphaChangesAllowed':False,
            'geometryWarpAllowed':False,
            'wheelOrTyreReplacementAllowed':False,
            'accessoryGeometryAllowed':False,
            'newBodyLinesAllowed':False,
            'rgbNeutralisationInsideEnvelopeOnly':True,
            'productionPromotionAllowedByThisContract':False
        },
        'rightsState':{
            'ownerReferences':'internal-canonical-development-approved',
            'directPhotoDerivedProductionBinaryRights':'not-separately-recorded',
            'futureRetouchProductionRights':'must-be-recorded-before-promotion'
        },
        'artifacts':{
            'envelopeFile':str(MASK_OUT.relative_to(ROOT)).replace('\\','/'),
            'envelopeSha256':sha256(MASK_OUT),
            'boardFile':str(BOARD_OUT.relative_to(ROOT)).replace('\\','/'),
            'boardSha256':sha256(BOARD_OUT)
        },
        'productionEligible':False,
        'nextDependency':'Create a neutralised Candidate 04 under this immutable geometry lock, then rerun overlay/reviewer evidence; separately record production rights and identified reviewer approval before WF5 promotion.'
    }
    JSON_OUT.write_text(json.dumps(evidence, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(evidence, indent=2))

if __name__ == '__main__':
    main()
