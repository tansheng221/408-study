[Setup]
AppId={{CA618DA6-65CE-4EA0-AD3B-408081122001}
AppName=408 智能挖空学习器
AppVersion=1.0.0
AppPublisher=408 Study
DefaultDirName={localappdata}\Programs\408Study
DefaultGroupName=408 智能挖空学习器
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir=..\..
OutputBaseFilename=408-Study-Setup-1.0.0-win-x64
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
UninstallDisplayIcon={app}\408Study.exe
CloseApplications=yes
SetupMutex=Study408Setup

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "..\dist\windows\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autodesktop}\408 智能挖空学习器"; Filename: "{app}\408Study.exe"
Name: "{group}\408 智能挖空学习器"; Filename: "{app}\408Study.exe"
Name: "{group}\卸载学习器"; Filename: "{uninstallexe}"

[Run]
Filename: "{app}\408Study.exe"; Description: "启动 408 智能挖空学习器"; Flags: nowait postinstall skipifsilent
