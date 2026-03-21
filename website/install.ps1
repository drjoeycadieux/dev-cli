# Dev-CLI Installation Script for Windows
# This script automatically builds and installs Dev-CLI if you're in the repo,
# or provides instructions for remote installation.

Write-Host "🚀 Starting Dev-CLI Setup..." -ForegroundColor Cyan

# Check for winget
if (!(Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "ℹ Winget not found. Installing Windows Package Manager..." -ForegroundColor Yellow
    Write-Host "Please install 'App Installer' from the Microsoft Store." -ForegroundColor Red
    exit
}

Write-Host "✔ Winget is available!" -ForegroundColor Green

# Check if we're in the dev-cli repository
if (Test-Path "Cargo.toml") {
    Write-Host "`n✅ Dev-CLI repository detected!" -ForegroundColor Green
    Write-Host "Starting automatic build and setup..." -ForegroundColor Cyan
    
    # Check if Rust/Cargo is installed
    if (!(Get-Command cargo -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Error: Cargo not found. Please install Rust from https://rustup.rs/" -ForegroundColor Red
        exit
    }
    
    Write-Host "`n🔨 Building Dev-CLI from source..." -ForegroundColor Cyan
    cargo build --release
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit
    }
    
    Write-Host "`n🔧 Running setup script..." -ForegroundColor Cyan
    & ".\setup.ps1"
    
} else {
    Write-Host "`n--- Remote Installation ---" -ForegroundColor Cyan
    Write-Host "To install Dev-CLI, clone the repository and build from source:"
    Write-Host "1. git clone https://github.com/drjoeycadieux/dev-cli"
    Write-Host "2. cd dev-cli"
    Write-Host "3. cargo build --release"
    Write-Host "4. ./setup.ps1`n"
}

Write-Host "--- Usage ---" -ForegroundColor Cyan
Write-Host "Usage: dev-cli install <tool>"
