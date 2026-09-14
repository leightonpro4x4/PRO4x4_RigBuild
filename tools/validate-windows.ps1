param([string]$Node,[string]$Python)
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
Set-Location $repo
if ((git branch --show-current) -ne 'alpha94-consolidation') { throw 'Wrong branch; stop here.' }
if (-not $Node) {
    $Node = (Get-Command node -ErrorAction SilentlyContinue).Source
    if (-not $Node) { $Node = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" }
}
if (-not $Python) {
    $bundledPython = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
    if (Test-Path -LiteralPath $bundledPython) { $Python = $bundledPython } else { $Python = (Get-Command python).Source }
}
if ((& $Node --version) -ne 'v24.19.0') { throw 'Node 24.19.0 is required.' }
if ((& $Python --version) -ne 'Python 3.12.14') { throw 'Python 3.12.14 is required.' }
$env:PATH = "$(Split-Path $Node);$env:PATH"
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $repo '.validation\browsers'
& $Python tools/bootstrap-npm.py
if ($LASTEXITCODE -ne 0) { throw 'Pinned npm bootstrap failed.' }
$npmCli = Join-Path $repo '.validation\bootstrap\npm\package\bin\npm-cli.js'
& $Node $npmCli ci --ignore-scripts --cache .validation/npm-cache
if ($LASTEXITCODE -ne 0) { throw 'npm ci failed.' }
& $Python -m venv .venv
if ($LASTEXITCODE -ne 0) { throw 'Isolated Python environment creation failed.' }
& .\.venv\Scripts\python.exe -m pip install --cache-dir .validation/pip-cache --require-hashes --only-binary=:all: -r requirements-validation.lock
if ($LASTEXITCODE -ne 0) { throw 'Locked Python dependency installation failed.' }
& $Node node_modules/playwright/cli.js install chromium
if ($LASTEXITCODE -ne 0) { throw 'Pinned Chromium installation failed.' }
& $Node $npmCli test
if ($LASTEXITCODE -ne 0) { throw 'Stage 8 validation failed. Stop here.' }
Write-Output 'STAGE 8 ROOT VALIDATION PASS — no commits or pushes performed.'
