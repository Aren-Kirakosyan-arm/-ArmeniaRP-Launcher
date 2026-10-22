#define MyAppName "ArmeniaRP Launcher"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "ArmeniaRP"
#define MyAppExeName "ArmeniaRP.Launcher.exe"

[Setup]
AppId={{A6B9D0F0-3A44-4A8C-9E3B-ARMENIARP001}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\ArmeniaRP Launcher
DefaultGroupName=ArmeniaRP Launcher
OutputDir=installer-output
OutputBaseFilename=ArmeniaRP-Launcher-Setup
Compression=lzma2
SolidCompression=yes
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
DisableProgramGroupPage=yes
UninstallDisplayIcon={app}\{#MyAppExeName}

[Files]
Source: "publish\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\ArmeniaRP Launcher"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\ArmeniaRP Launcher"; Filename: "{app}\{#MyAppExeName}"

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Գործարկել ArmeniaRP Launcher-ը"; Flags: nowait postinstall skipifsilent
