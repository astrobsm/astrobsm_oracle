# PowerShell script to rebuild React, update backend static files, commit, and push
# Save this as deploy.ps1 in your project root and run it from there

# Navigate to project root
$projectRoot = "C:\Users\USER\Documents\SOFTWARE DEVELOPEMENT\ORACLE DEVELOPEMENT\AstroBSM-Oracle-IVANSTAMAS"
Set-Location $projectRoot

# Build React frontend
Write-Host "Building React frontend..."
cd frontend/react-app
npm run build
cd ../..

# Copy build output to backend static directory
Write-Host "Copying build output to backend static directory..."
Copy-Item -Path frontend/react-app/build/* -Destination backend/app/static/ -Recurse -Force

# Stage changes
Write-Host "Staging changes for git..."
git add frontend/react-app/src/config.js backend/app/static/

# Commit and push
Write-Host "Committing and pushing to GitHub..."
git commit -m "Automated deploy: Rebuild React, update static files, and ensure correct API base URL for CORS-free deployment"
git push

Write-Host "Deployment script complete. Check Render for redeployment status."
