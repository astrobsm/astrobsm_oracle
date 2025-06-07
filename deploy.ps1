# PowerShell script: Build React, deploy to backend static, commit, and push
# Run from project root after making changes to frontend or backend

$ErrorActionPreference = 'Stop'

$projectRoot = "C:\Users\USER\Documents\SOFTWARE DEVELOPEMENT\ORACLE DEVELOPEMENT\AstroBSM-Oracle-IVANSTAMAS"
$reactApp = "$projectRoot\frontend\react-app"
$reactBuild = "$reactApp\build"
$backendStatic = "$projectRoot\backend\app\static"

Write-Host "[1/6] Building React frontend..." -ForegroundColor Cyan
Set-Location $reactApp
npm run build

Write-Host "[2/6] Copying build output to backend static directory..." -ForegroundColor Cyan
Set-Location $projectRoot
if (!(Test-Path $backendStatic)) {
    Write-Host "Backend static directory not found. Creating: $backendStatic"
    New-Item -ItemType Directory -Path $backendStatic | Out-Null
}
# Remove old static files except .gitkeep (if present)
Get-ChildItem -Path $backendStatic -Recurse | Where-Object { $_.Name -ne '.gitkeep' } | Remove-Item -Force -Recurse
Copy-Item -Path "$reactBuild\*" -Destination $backendStatic -Recurse

Write-Host "[3/6] Staging all changes for git..." -ForegroundColor Cyan
Set-Location $projectRoot
git add .

Write-Host "[4/6] Committing changes..." -ForegroundColor Cyan
$commitMsg = "Automated build+deploy: React rebuilt, static files updated, and all changes committed"
git commit -m "$commitMsg"

Write-Host "[5/6] Pushing to GitHub..." -ForegroundColor Cyan
git push

Write-Host "[6/6] Dropping alembic_version table in production database (if needed)..." -ForegroundColor Cyan
Set-Location "$projectRoot\backend"
python drop_alembic_version.py
Set-Location $projectRoot
Write-Host "Alembic version table dropped. Next deploy will re-apply all migrations if needed."

Write-Host "✅ Build, deploy, and git push complete. Check your backend deployment and frontend UI."
