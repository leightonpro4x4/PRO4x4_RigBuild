"""Optional Windows developer bootstrap; CI uses setup-node and pinned npm directly."""
import base64
import hashlib
import io
import pathlib
import tarfile
import urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
DEST=ROOT/'.validation/bootstrap/npm'
DATA=urllib.request.urlopen('https://registry.npmjs.org/npm/-/npm-11.11.0.tgz').read()
EXPECTED='sha512-82gRxKrh/eY5UnNorkTFcdBQAGpgjWehkfGVqAGlJjejEtJZGGJUqjo3mbBTNbc5BTnPKGVtGPBZGhElujX5cw=='
assert 'sha512-'+base64.b64encode(hashlib.sha512(DATA).digest()).decode()==EXPECTED, 'npm archive integrity mismatch'
DEST.mkdir(parents=True,exist_ok=True)
with tarfile.open(fileobj=io.BytesIO(DATA),mode='r:gz') as archive:
    archive.extractall(DEST,filter='data')
print(DEST/'package/bin/npm-cli.js')
