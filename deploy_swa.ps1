# Deploy to Azure Static Web App (organic-shop-swa)

$APP_NAME = "organic-shop-swa"
$RESOURCE_GROUP = "rg-organic-shop"
$LOCATION = "eastus2" # Standard SWA location, though resource group is what matters most for finding it

Write-Host "Starting Azure Static Web App Deployment..."
Write-Host "Target App: $APP_NAME"
Write-Host "Resource Group: $RESOURCE_GROUP"

# 1. Build
Write-Host "Building project..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# 2. Deploy
Write-Host "Deploying to Azure Static Web Apps..."
# Using --no-wait to avoid hanging if it takes long, monitoring manually or trusted CI/CD usually better but for this script we wait for completion by default (no flag implies wait for basic validation)
az staticwebapp deploy --name $APP_NAME --resource-group $RESOURCE_GROUP --source ./dist --environment production

Write-Host "--------------------------------------------------"
Write-Host "Deployment Command Executed."
Write-Host "Check the URL: https://black-sky-0b4c4de03.4.azurestaticapps.net/"
Write-Host "--------------------------------------------------"
