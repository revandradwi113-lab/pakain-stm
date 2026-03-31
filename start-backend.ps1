# PowerShell Script untuk start backend dengan auto-restart
# Usage: .\start-backend.ps1

param(
    [int]$MaxRestarts = 10,
    [int]$RestartDelay = 3,
    [int]$MaxMemory = 300
)

$RestartCount = 0
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $ScriptDir "backend"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $Color = @{
        "INFO"    = "Green"
        "WARNING" = "Yellow"
        "ERROR"   = "Red"
        "RESTART" = "Cyan"
    }[$Level]
    Write-Host "[$Timestamp] [$Level] $Message" -ForegroundColor $Color
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Blue
Write-Host "  BACKEND SERVER WITH AUTO-RESTART" -ForegroundColor Blue
Write-Host "======================================" -ForegroundColor Blue
Write-Host ""
Write-Log "Configuration:" "INFO"
Write-Log "  Max Restarts: $MaxRestarts" "INFO"
Write-Log "  Restart Delay: ${RestartDelay}s" "INFO"
Write-Log "  Max Memory: ${MaxMemory}MB" "INFO"
Write-Log "  Backend Dir: $BackendDir" "INFO"
Write-Host ""

while ($RestartCount -lt $MaxRestarts) {
    $RestartCount++
    
    if ($RestartCount -gt 1) {
        Write-Log "Restarting backend... (Attempt $RestartCount/$MaxRestarts)" "RESTART"
        Write-Log "Waiting $RestartDelay seconds before restart..." "WARNING"
        Start-Sleep -Seconds $RestartDelay
        Clear-Host
    }
    
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Blue
    Write-Host "  BACKEND SERVER - Attempt $RestartCount/$MaxRestarts" -ForegroundColor Blue
    Write-Host "======================================" -ForegroundColor Blue
    Write-Host ""
    Write-Log "Starting backend server..." "INFO"
    Write-Log "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "INFO"
    Write-Host ""
    
    # Start backend process
    Push-Location $BackendDir
    try {
        $Process = Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow -PassThru -ErrorAction Stop
        
        # Wait for process to complete
        $Process.WaitForExit()
        $ExitCode = $Process.ExitCode
        
        Write-Host ""
        Write-Log "Backend process ended (Exit Code: $ExitCode)" "WARNING"
    }
    catch {
        Write-Log "Error starting backend: $_" "ERROR"
    }
    finally {
        Pop-Location
    }
    
    # Check if max restarts exceeded
    if ($RestartCount -ge $MaxRestarts) {
        Write-Host ""
        Write-Log "Max restart attempts reached ($MaxRestarts)" "ERROR"
        Write-Log "Please check the error logs above and fix the issue" "ERROR"
        Write-Host ""
        pause
        exit 1
    }
}

Write-Host ""
Write-Log "Exiting..." "INFO"
exit 0
