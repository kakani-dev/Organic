$APP_NAME = "organic-CEN-8333"
$RESOURCE_GROUP = "rg-organic-cen-8333"
$ZIP_PATH = "deploy_manual.zip"

Write-Host "Preparing deployment for $APP_NAME..."

# 1. Build Production
Write-Host "Building project..."
cmd /c "yarn build"

# 2. Update Configuration
Write-Host "Updating Configuration (Node 20)..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings "WEBSITE_NODE_DEFAULT_VERSION=~20" "NODE_ENV=production"

# 3. Zip Artifacts
Write-Host "Creating Zip Artifact..."
if (Test-Path $ZIP_PATH) { Remove-Item $ZIP_PATH }
Compress-Archive -Path dist, server, package.json, yarn.lock -DestinationPath $ZIP_PATH -Force

# 4. Deploy
Write-Host "Deploying to Azure..."
az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APP_NAME --src $ZIP_PATH

Write-Host "Deployment Completed!"
Write-Host "URL: https://$APP_NAME.azurewebsites.net"
