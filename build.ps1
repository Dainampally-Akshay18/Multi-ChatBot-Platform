Write-Host "🚀 Building Multi-Chatbot Platform for Production" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Set environment variables
$env:NODE_ENV = "production"
$env:CI = "true"

# Navigate to frontend
Write-Host "📁 Navigating to frontend..." -ForegroundColor Yellow
Set-Location frontend

# Clean installation
Write-Host "🧹 Cleaning previous installation..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -ErrorAction SilentlyContinue
}

# Clear cache and install
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm cache clean --force
npm install

# Check Vite
Write-Host "🔍 Checking Vite..." -ForegroundColor Yellow
$viteCheck = npm list vite 2>$null
if (-not $viteCheck) {
    Write-Host "Installing Vite explicitly..." -ForegroundColor Yellow
    npm install -D vite@^5.0.8 @vitejs/plugin-react
}

# Build
Write-Host "📦 Building..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Trying alternative build method..." -ForegroundColor Yellow
    npx vite build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Build completed!" -ForegroundColor Green

# Go back and prepare backend
Set-Location ..
Write-Host "📋 Preparing backend..." -ForegroundColor Yellow

if (Test-Path "backend/netlify/app") {
    Remove-Item -Recurse -Force "backend/netlify/app" -ErrorAction SilentlyContinue
}

New-Item -ItemType Directory -Force -Path "backend/netlify" | Out-Null
Copy-Item -Recurse "backend/app" "backend/netlify/" -ErrorAction SilentlyContinue
Copy-Item "backend/requirements.txt" "backend/netlify/" -ErrorAction SilentlyContinue
Copy-Item "backend/.env.example" "backend/netlify/" -ErrorAction SilentlyContinue

Write-Host "🎉 Build complete!" -ForegroundColor Green
