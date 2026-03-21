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

Write-Host "`n--- Local Setup (Developer) ---" -ForegroundColor Cyan
Write-Host "Since you have the source code, you can run the local setup script:"
Write-Host "./setup.ps1"
Write-Host "`n--- General Installation ---" -ForegroundColor Gray
Write-Host "To complete the installation manually, you need to build the project from source:"
Write-Host "1. git clone https://github.com/drjoeycadieux/dev-cli"
Write-Host "2. cd dev-cli"
Write-Host "3. cargo build --release"
Write-Host "4. ./setup.ps1  <-- NEW: Run the setup script to add to PATH"

Write-Host "`n--- Usage ---" -ForegroundColor Cyan
Write-Host "Usage: dev-cli install <tool>"
