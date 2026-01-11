# Deploy to Azure Web App (Central US - Windows - Fixed)

$RANDOM_ID = Get-Random -Minimum 1000 -Maximum 9999
$RESOURCE_GROUP = "rg-organic-cen-" + $RANDOM_ID
$LOCATION = "centralus"
$PLAN_NAME = "plan-organic-cen-" + $RANDOM_ID
$APP_NAME = "organic-CEN-" + $RANDOM_ID
$ZIP_PATH = "deploy.zip"

Write-Host "Starting Azure Deployment (Central US Fixed)..."
Write-Host "Group: $RESOURCE_GROUP"
Write-Host "App: $APP_NAME"

# 1. Create Resource Group
Write-Host "Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION
Start-Sleep -Seconds 5

# 2. Create App Service Plan (Windows F1)
Write-Host "Creating App Service Plan..."
# Correct SKU is F1 (not F1Number)
az appservice plan create --name $PLAN_NAME --resource-group $RESOURCE_GROUP --sku F1
Start-Sleep -Seconds 20

# 3. Create Web App
Write-Host "Creating Web App..."
az webapp create --resource-group $RESOURCE_GROUP --plan $PLAN_NAME --name $APP_NAME
Start-Sleep -Seconds 20

# 4. Config
Write-Host "Configuring..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings "WEBSITE_NODE_DEFAULT_VERSION=~18" "NODE_ENV=production" "STRIPE_SECRET_KEY=placeholder" "VITE_STRIPE_PUBLISHABLE_KEY=placeholder" "EMAIL_USER=placeholder" "EMAIL_PASS=placeholder" "VITE_API_URL=https://$APP_NAME.azurewebsites.net"

# 5. Zip
Write-Host "Zipping..."
if (Test-Path $ZIP_PATH) { Remove-Item $ZIP_PATH }
Compress-Archive -Path dist, server, package.json, yarn.lock -DestinationPath $ZIP_PATH -CompressionLevel Optimal

# 6. Deploy
Write-Host "Deploying..."
az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APP_NAME --src $ZIP_PATH

Write-Host "Done! URL: https://$APP_NAME.azurewebsites.net"
