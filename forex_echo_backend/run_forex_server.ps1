# -----------------------------
# Forex Echo Backend Startup + Live Logs Monitoring
# -----------------------------

$ProjectPath = "C:\Users\fxlabs04\Desktop\forex_echo_backend"
$VenvPath = "$ProjectPath\venv\Scripts\Activate.ps1"
$LogFile = "$ProjectPath\data\logs/app.log"
$SignalsPath = "$ProjectPath\data\logs/signals_*.csv"
$TradesPath = "$ProjectPath\data\logs/trades/*.csv"
$PORT = 8000

# 1️⃣ Activate virtual environment
Write-Host "Activating virtual environment..."
& $VenvPath

# 2️⃣ Detect IPs
$privateIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -like "*Ethernet*" -and $_.IPAddress -notlike "169.*" } | Select-Object -First 1 -ExpandProperty IPAddress)
$publicIP = "20.83.157.24"   # Your VPS public IP (hardcoded if needed)

Write-Host "`nServer will be accessible on:"
Write-Host "Private IP : http://$privateIP`: ${PORT}"
Write-Host "Public IP  : http://$publicIP`: ${PORT}"
Write-Host "----------------------------------------"

# 3️⃣ Start Waitress server in background
Write-Host "Starting Forex Echo Backend on all interfaces (0.0.0.0:$PORT)...`n"
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "$ProjectPath\run.py"

# 4️⃣ Wait a few seconds for server to start
Start-Sleep -Seconds 3

# 5️⃣ Live monitoring console
Write-Host "===== LIVE APP LOGS ====="
if (Test-Path $LogFile) {
    Start-Job { Get-Content $using:LogFile -Wait }
} else {
    Write-Host "Log file not found: $LogFile"
}

# 6️⃣ Tail latest signals CSV
Write-Host "`n===== LATEST SIGNALS ====="
$latestSignal = Get-ChildItem -Path $SignalsPath | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($latestSignal) {
    Start-Job { Get-Content $using:latestSignal.FullName -Wait }
} else {
    Write-Host "No signals CSV found yet."
}

# 7️⃣ Tail latest trade CSV
Write-Host "`n===== LATEST TRADES ====="
$latestTrade = Get-ChildItem -Path $TradesPath | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($latestTrade) {
    Start-Job { Get-Content $using:latestTrade.FullName -Wait }
} else {
    Write-Host "No trades CSV found yet."
}

Write-Host "`nAll live logs are now being displayed. Press Ctrl+C to stop."
