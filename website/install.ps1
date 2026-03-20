# Dev-CLI Installation Script for Windows
# This script ensures winget is available and prepares the environment for Dev-CLI.

Write-Host "🚀 Starting Dev-CLI Setup..." -ForegroundColor Cyan

# Check for winget
if (!(Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "ℹ Winget not found. Installing Windows Package Manager..." -ForegroundColor Yellow
    # Note: Modern Windows 10/11 should have it, but this is a safeguard.
    # Instruction for user if automated install fails.
    Write-Host "Please install 'App Installer' from the Microsoft Store." -ForegroundColor Red
    exit
}

Write-Host "✔ Winget is available!" -ForegroundColor Green

# Since we are in development, we'll provide instructions for building from source
# In a real production scenario, this script would download the compiled .exe
Write-Host "`nTo complete the installation, you need to build the project from source:" -ForegroundColor White
Write-Host "1. git clone https://github.com/drjoeycadieux/dev-cli"
Write-Host "2. cd dev-cli"
Write-Host "3. cargo build --release"
Write-Host "`nThen move 'target/release/dev-cli.exe' to your PATH." -ForegroundColor Gray

Write-Host "`n--- Or use it to install tools directly via winget ---" -ForegroundColor Cyan
Write-Host "Usage: dev-cli install <tool>"
