# Deploy to Azure Web App (Existing Plan)
# Using 'rg-organic-shop' and 'plan-organic-shop' found in subscription

$RESOURCE_GROUP = "rg-organic-shop"
$PLAN_NAME = "plan-organic-shop"
$APP_NAME = "organic-shop-live-" + (Get-Random -Minimum 1000 -Maximum 9999)
$ZIP_PATH = "deploy.zip"

Write-Host "Starting Azure Deployment (Targeting Existing Plan)..."
Write-Host "Resource Group: $RESOURCE_GROUP"
Write-Host "Plan: $PLAN_NAME"
Write-Host "App Name: $APP_NAME"

# 1. Create Web App (Assuming Windows Plan from 'Kind: app')
Write-Host "Creating Web App..."
az webapp create --resource-group $RESOURCE_GROUP --plan $PLAN_NAME --name $APP_NAME
# Note: Location is inherited from Plan

# 2. Configure Environment Variables
# Setting Node Version for Windows
Write-Host "Configuring Settings..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings "WEBSITE_NODE_DEFAULT_VERSION=~18" "NODE_ENV=production" "STRIPE_SECRET_KEY=placeholder" "VITE_STRIPE_PUBLISHABLE_KEY=placeholder" "EMAIL_USER=placeholder" "EMAIL_PASS=placeholder" "VITE_API_URL=https://$APP_NAME.azurewebsites.net"

# 3. Zip Deployment
Write-Host "Zipping files..."
if (Test-Path $ZIP_PATH) { Remove-Item $ZIP_PATH }
Compress-Archive -Path dist, server, package.json, yarn.lock -DestinationPath $ZIP_PATH -CompressionLevel Optimal

# 4. Deploy
Write-Host "Deploying Zip..."
az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APP_NAME --src $ZIP_PATH

Write-Host "--------------------------------------------------"
Write-Host "Deployment Complete!"
Write-Host "Your URL: https://$APP_NAME.azurewebsites.net"
Write-Host "--------------------------------------------------"
