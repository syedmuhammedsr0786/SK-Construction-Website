param(
  [int]$Port = 5500
)

$ErrorActionPreference = 'Stop'

Write-Host ("Serving this folder at http://localhost:{0}/" -f $Port)
Write-Host ("Open: http://localhost:{0}/index.html" -f $Port)
Write-Host ""

if (Get-Command python -ErrorAction SilentlyContinue) {
  python -m http.server $Port
  exit $LASTEXITCODE
}

if (Get-Command py -ErrorAction SilentlyContinue) {
  py -m http.server $Port
  exit $LASTEXITCODE
}

Write-Error "Python not found. Install Python, or use the VS Code Live Server extension."

