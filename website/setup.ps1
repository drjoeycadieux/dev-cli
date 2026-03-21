# Dev-CLI Local Setup Script
# This script adds the 'bin' folder to your User PATH so you can use 'dev-cli' anywhere.

$binPath = Join-Path (Get-Location) "bin"
$exePath = Join-Path $binPath "dev-cli.exe"

Write-Host "🔧 Setting up Dev-CLI locally..." -ForegroundColor Cyan

if (!(Test-Path $exePath)) {
    Write-Host "❌ Error: dev-cli.exe not found in 'bin' folder. Please run 'cargo build --release' first." -ForegroundColor Red
    exit
}

# Get current User PATH
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($oldPath -like "*$binPath*") {
    Write-Host "✅ Dev-CLI is already in your PATH!" -ForegroundColor Green
} else {
    $newPath = "$oldPath;$binPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "🚀 Success! 'bin' folder added to your User PATH." -ForegroundColor Green
    Write-Host "👉 Please RESTART your terminal to start using 'dev-cli'." -ForegroundColor Yellow
}

Write-Host "`nTest it out with:" -ForegroundColor Gray
Write-Host "dev-cli --help" -ForegroundColor White
