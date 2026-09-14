"""Current Alpha94 candidate evidence tests. Frozen WF3 ZIP is data, never an app binding."""
import contextlib
import ast
import hashlib
import importlib.util
import io
import json
import pathlib
import sys
import unittest
import uuid
import zipfile
try:
    import cv2
    import numpy as np
    from PIL import Image, ImageDraw
except ImportError as e:
    print(json.dumps({'status':'BLOCKED_ENVIRONMENT','error':str(e),'action':'Install requirements-validation.lock in .venv'}))
    sys.exit(78)
from importlib.metadata import version

ROOT = pathlib.Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location('alpha94_review', ROOT/'subsystems/y62-evidence/review_pipeline.py')
PIPE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PIPE)
ARCHIVE = zipfile.ZipFile(ROOT/'evidence/archive/snapshots/wf3.zip')
BASELINE = json.loads((ROOT/'subsystems/governance/baseline.json').read_text())
R34 = json.loads((ROOT/'subsystems/y62-evidence/r34-candidate05.json').read_text())
OUT = ROOT/'.validation/python'/str(uuid.uuid4())
OUT.mkdir(parents=True)
def read(p): return ARCHIVE.read('wf3_run56/'+p)
def digest(b): return hashlib.sha256(b).hexdigest()
def image(p): return np.array(Image.open(io.BytesIO(read(p))).convert('RGBA'))
def fixture(name, data):
    p = OUT/name
    p.write_bytes(data)
    return p
OWNER = fixture('owner.jpeg', read('references/y62-owner/IMG_4030.jpeg'))
C04 = fixture('f34-c04.png', read('assets/y62-canonical-candidates/Y62-F34-V1-neutral-reconstruction-v04.png'))

class Candidates(unittest.TestCase):
    def test_01_declared_isolated_runtime(self):
        self.assertEqual(pathlib.Path(sys.prefix).resolve(), (ROOT/'.venv').resolve())
        self.assertEqual('.'.join(map(str,sys.version_info[:3])), (ROOT/'.python-version').read_text().strip())
        for name,want in [('opencv-python-headless','5.0.0.93'),('numpy','2.5.3'),('Pillow','12.3.0')]:
            self.assertEqual(version(name),want)
        self.assertTrue(hasattr(cv2,'SIFT_create'))

    def test_02_source_binary_and_mask_hashes(self):
        for key in ['source','candidate','mask','preview','board']:
            self.assertEqual(digest(read(R34[key]['file'])),R34[key]['sha256'])

    def test_03_lineage_manifests_exist_with_exact_hashes(self):
        hashes={f['sha256'] for f in BASELINE['sourceFiles'] if f['branch']=='wf3'}
        for k,v in R34['lineage'].items():
            if k.endswith('Sha256'): self.assertIn(v,hashes)

    def test_04_nine_scoped_candidates_no_fabricated_f34_05(self):
        candidates=BASELINE['candidates']
        self.assertEqual(len({c['id'] for c in candidates}),9)
        self.assertFalse(any(c['viewId']=='front34' and c['candidateId'].endswith('-05') for c in candidates))
        for c in candidates:
            self.assertEqual(digest(ARCHIVE.read(c['source']['path'])),c['sha256'])
            self.assertFalse(c['productionEligible'])

    def test_05_r34_rgb_and_subtractive_alpha_reconstruction(self):
        old=image('assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v04.png')
        new=image(R34['candidate']['file'])
        np.testing.assert_array_equal(old[:,:,:3],new[:,:,:3])
        self.assertTrue(np.all(new[:,:,3]<=old[:,:,3]))
        self.assertEqual(int(np.sum(old[:,:,3]!=new[:,:,3])),1099)
        self.assertEqual(int(np.sum((old[:,:,3]==0)&(new[:,:,3]>0))),0)
        self.assertEqual(int(np.sum(new[:,:,3]>0)),116605)

    def test_06_mask_matches_exact_candidate_crop(self):
        arr=image(R34['candidate']['file'])[:,:,3]
        mask=np.array(Image.open(io.BytesIO(read(R34['mask']['file']))))
        np.testing.assert_array_equal(arr[45:570,486:1186],mask)

    def test_07_opencv_support_and_bbox(self):
        alpha=image(R34['candidate']['file'])[:,:,3]
        points=cv2.findNonZero((alpha>0).astype(np.uint8))
        x,y,w,h=cv2.boundingRect(points)
        self.assertEqual([x,y,x+w-1,y+h-1],R34['metrics']['bbox'])
        self.assertEqual(cv2.countNonZero(alpha),R34['metrics']['nonzeroSupportPixels'])

    def test_08_reconstruction_rights_camera_and_f34_holds_survive(self):
        self.assertEqual(R34['review']['cleanNeutralReconstruction'],'fail')
        self.assertEqual(R34['review']['productionBinaryRights'],'hold')
        self.assertEqual(R34['review']['f34FamilyAlignment'],'hold')
        self.assertFalse(R34['candidate']['cameraMatched'])
        self.assertFalse(R34['candidate']['productionEligible'])
        self.assertEqual(BASELINE['reconciliation']['f34State'],'blocked-upstream')
        self.assertEqual(BASELINE['reconciliation']['sideSourceGap'],'open/current')

    def test_13_exact_authorised_cleanup_reconstructs_candidate_pixels(self):
        # The frozen builder's polygon literals are evidence fixtures, not imported executable code.
        tree=ast.parse(read('tools/build-y62-r34-candidate05-second-targeted-alpha-cleanup.py'))
        zones={}
        for n in ast.walk(tree):
            if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name) and n.targets[0].id in ['mirror_polys','underbody_polys']:
                zones[n.targets[0].id]=ast.literal_eval(n.value)
        self.assertEqual(len(zones),2)
        old=image('assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v04.png')
        mask=Image.new('L',(1672,615),0);draw=ImageDraw.Draw(mask)
        for polygon in zones['mirror_polys']+zones['underbody_polys']:draw.polygon(polygon,fill=255)
        rebuilt=old.copy();rebuilt[np.array(mask)>0,3]=0
        np.testing.assert_array_equal(rebuilt,image(R34['candidate']['file']))

    def run_pipeline(self,candidate,mutate=None):
        intake={'contractId':PIPE.INTAKE_ID,'candidateId':PIPE.EXPECTED_ID,'structurallyReady':True,'binary':{'sha256':digest(candidate.read_bytes())}}
        manifest={'contractId':PIPE.INTAKE_ID,'candidateId':PIPE.EXPECTED_ID,'cameraTransferContractId':PIPE.CAMERA_ID}
        if mutate: mutate(intake,manifest)
        ir=fixture('intake.json',json.dumps(intake).encode()); im=fixture('manifest.json',json.dumps(manifest).encode()); result=OUT/'result.json'
        with contextlib.redirect_stdout(io.StringIO()):
            try: PIPE.main([str(candidate),str(ir),str(im),'--out-dir',str(OUT),'--json-out',str(result),'--owner-reference',str(OWNER)])
            except SystemExit as e: code=e.code
            else: code=0
        return code,json.loads(result.read_text())

    def test_09_candidate04_cannot_impersonate_candidate05(self):
        code,r=self.run_pipeline(C04)
        self.assertEqual(code,2)
        self.assertTrue(any('Candidate 04 cannot be reused' in x for x in r['issues']))
        self.assertFalse(r['productionEligible'])

    def test_10_wrong_intake_checksum_rejected(self):
        code,r=self.run_pipeline(C04,lambda i,m:i['binary'].update(sha256='0'*64))
        self.assertEqual(code,2)
        self.assertTrue(any('SHA-256 does not match' in x for x in r['issues']))

    def test_11_wrong_camera_contract_rejected(self):
        code,r=self.run_pipeline(C04,lambda i,m:m.update(cameraTransferContractId='wrong'))
        self.assertEqual(code,2)
        self.assertTrue(any('camera-transfer contract mismatch' in x for x in r['issues']))

    def test_12_real_opencv_review_generation_never_approves(self):
        # Isolated synthetic QA control, not a real F34 Candidate05 or a source modification.
        arr=np.array(Image.open(C04).convert('RGBA')); arr[0,0,0]^=1
        candidate=OUT/'synthetic-qa-only.png'; Image.fromarray(arr).save(candidate)
        code,r=self.run_pipeline(candidate)
        self.assertIn(code,[0,3]) # numeric registration can pass/return; neither is semantic approval.
        self.assertEqual(r['machinePrecheck']['authority'],'preflight-only')
        self.assertFalse(r['machinePrecheck']['productionEligible'])
        self.assertFalse(r['reviewDecision']['cameraGeometryMatched'])
        self.assertFalse(r['reviewDecision']['masterApproved'])
        self.assertFalse(r['reviewDecision']['productionEligible'])
        self.assertIsNone(r['reviewDecision']['reviewerId'])
        self.assertTrue((OUT/'Y62-F34-V1-candidate-05-review-evidence-v01.png').exists())

if __name__=='__main__':
    result=unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(Candidates))
    report={'status':'PASS' if result.wasSuccessful() else 'FAIL','tests':result.testsRun,'failures':len(result.failures),'errors':len(result.errors),'python':sys.version.split()[0],'isolatedPrefix':sys.prefix,'productionPromoted':False}
    destination=ROOT/'.validation/results';destination.mkdir(parents=True,exist_ok=True)
    (destination/'python.json').write_text(json.dumps(report,indent=2)+'\n')
    ARCHIVE.close();sys.exit(0 if result.wasSuccessful() else 1)
