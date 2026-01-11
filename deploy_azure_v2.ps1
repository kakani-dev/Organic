# Deploy to Azure Web App (Single Service) - V2 (Unique Names)

# Config - Using new names to avoid conflicts
$RANDOM_ID = Get-Random -Minimum 10000 -Maximum 99999
$RESOURCE_GROUP = "rg-organic-v2-" + $RANDOM_ID
$LOCATION = "eastus"
$PLAN_NAME = "plan-organic-v2-" + $RANDOM_ID
$APP_NAME = "app-organic-" + $RANDOM_ID
$ZIP_PATH = "deploy.zip"

Write-Host "Starting Azure Deployment V2..."
Write-Host "Resource Group: $RESOURCE_GROUP"
Write-Host "App Name: $APP_NAME"

# 1. Create Resource Group
Write-Host "Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Create App Service Plan (Free Tier F1, Linux)
Write-Host "Creating App Service Plan (F1 Free Tier)..."
az appservice plan create --name $PLAN_NAME --resource-group $RESOURCE_GROUP --sku F1 --is-linux

# 3. Create Web App
Write-Host "Creating Web App (This may take a minute)..."
az webapp create --resource-group $RESOURCE_GROUP --plan $PLAN_NAME --name $APP_NAME --runtime "NODE:18-lts"

# 4. Configure Environment Variables
Write-Host "Configuring Settings..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings "NODE_ENV=production" "STRIPE_SECRET_KEY=placeholder" "VITE_STRIPE_PUBLISHABLE_KEY=placeholder" "EMAIL_USER=placeholder" "EMAIL_PASS=placeholder" "VITE_API_URL=https://$APP_NAME.azurewebsites.net"

# 5. Zip Deployment
Write-Host "Zipping files..."
if (Test-Path $ZIP_PATH) { Remove-Item $ZIP_PATH }
Compress-Archive -Path dist, server, package.json, yarn.lock -DestinationPath $ZIP_PATH -CompressionLevel Optimal

# 6. Deploy
Write-Host "Deploying Zip..."
az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APP_NAME --src $ZIP_PATH

Write-Host "--------------------------------------------------"
Write-Host "Deployment Complete!"
Write-Host "Your URL: https://$APP_NAME.azurewebsites.net"
Write-Host "--------------------------------------------------"
