// Generated from governed source evidence; no reviewer or registry data is public.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const governancePolicy=freeze({
  "schemaVersion": "alpha94-visual-policy-v1",
  "basisSha256": "34a9848a81354770d5d0851698bbe39874c22ff81e0f881042863e1e84503c91",
  "ranger": {
    "vehicleId": "ford-ranger-nextgen-2025",
    "state": "preview",
    "productionApproved": false,
    "assets": [
      {
        "file": "ranger-static-front-rear.glb",
        "sha256": "2a244cf1cee451be19cd224ae6ed68760e024da7283f6b036a27afe270d8ed60",
        "state": "preview"
      },
      {
        "file": "factory-front.glb",
        "sha256": "b135b9d3db1d4aff1e69d573047cfe3c828bceb9b75b831d12ca5da579f96878",
        "state": "preview"
      },
      {
        "file": "factory-rear.glb",
        "sha256": "eff2f7ad45895d83adf2ad82548b7d75dd1f5442b517408128a2f7eaec7a6f74",
        "state": "preview"
      },
      {
        "file": "predator.glb",
        "sha256": "2f2c4fcf091162735e270ca4ea092dbe89bf0aaa385dbac2b6ef627446249519",
        "state": "preview"
      },
      {
        "file": "rally-hoop-v3.glb",
        "sha256": "3cb6b26ab57e00c97adb6104d3dcb97f51304886ce44147306ce2c297c49fa67",
        "state": "preview"
      },
      {
        "file": "butt-kicker-7-pair-v1.glb",
        "sha256": "7f1ab253986add0ff84b23d175ddaf821d9c7394d3079d0e355de13e7e45ca3c",
        "state": "preview"
      },
      {
        "file": "scout.glb",
        "sha256": "b37db6f1899527082e588bc5c0c1cbc9c3e0edb1b6c4dcebfc84e99c0ed39049",
        "state": "preview"
      },
      {
        "file": "powerboards.glb",
        "sha256": "b173205219767daad0d0f0f4336176c7a0a8be77ed1a74890804aac70970c7c8",
        "state": "preview"
      },
      {
        "file": "tubrack.glb",
        "sha256": "08a94e0f765d2b772dcea4d776f8c0b44effc50cd9b1a7b5af75c2ab00377ae5",
        "state": "preview"
      },
      {
        "file": "rearbumper.glb",
        "sha256": "75cd2778113dd0935914e6acd2903ad8394f413c8db8271c4f6bc86a102d9729",
        "state": "preview"
      }
    ]
  },
  "y62": {
    "vehicleId": "nissan-y62-warrior-2025",
    "state": "blocked",
    "baseState": "unavailable",
    "productionApproved": false,
    "productionCount": 0,
    "fallback": "none",
    "views": {
      "front34": "blocked-upstream",
      "side": "source-gap-calibration",
      "rear34": "master-draft-camera-unmatched-reconstruction-failed"
    }
  }
});
