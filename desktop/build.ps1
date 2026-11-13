param(
    [Parameter(Mandatory=$true)][string]$NodeDirectory,
    [Parameter(Mandatory=$true)][string]$InnoCompiler
)
$ErrorActionPreference = 'Stop'
$project = Split-Path $PSScriptRoot -Parent
$dest = Join-Path $project 'dist/windows'
New-Item -ItemType Directory -Force "$dest/web", "$dest/runtime" | Out-Null
foreach ($file in @('index.html','app.js','engine.js','style.css')) {
    Copy-Item (Join-Path $project $file) "$dest/web"
}
Copy-Item (Join-Path $NodeDirectory 'node.exe') "$dest/runtime/node.exe"
Copy-Item (Join-Path $NodeDirectory 'LICENSE') "$dest/runtime/NODE-LICENSE.txt"
Copy-Item "$PSScriptRoot/desktop-server.js" $dest
$compiler = Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319/csc.exe'
& $compiler /nologo /target:winexe /reference:System.Windows.Forms.dll /reference:System.Drawing.dll "/out:$dest/408Study.exe" "$PSScriptRoot/Launcher.cs"
if ($LASTEXITCODE -ne 0) { throw 'Launcher compilation failed' }
& $InnoCompiler "$PSScriptRoot/installer.iss"
if ($LASTEXITCODE -ne 0) { throw 'Installer compilation failed' }
