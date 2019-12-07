# Powershell script for ask-cli pre-deploy hook for Node.js
# Script Usage: pre_deploy_hook.ps1 <SKILL_NAME> <DO_DEBUG> <TARGET>

# SKILL_NAME is the preformatted name passed from the CLI, after removing special characters.
# DO_DEBUG is boolean value for debug logging
# TARGET is the deploy TARGET provided to the CLI. (eg: all, skill, lambda etc.)

# Run this script under the skill root folder

# The script does the following:
#  - Run "npm install" in each sourceDir in skill.json

param(
    [string] $SKILL_NAME,
    [bool] $DO_DEBUG = $False,
    [string] $TARGET = "all"
)

function install_dependencies ($CWD, $SOURCE_DIR) {
    Set-Location $SOURCE_DIR
    Invoke-Expression "npm install --production" 2>&1 | Out-Null
    $EXEC_RESULT = $?
    Set-Location $CWD
    return $EXEC_RESULT
}

function update_skill_catalog () {
    Invoke-Expression "node tools\updateSkillCatalog.js" 2>&1 | Out-Null
    return $?
}

function update_skill_manifest () {
    Invoke-Expression "node tools\updateSkillManifest.js" 2>&1 | Out-Null
    return $?
}

if ($DO_DEBUG) {
    Write-Output "###########################"
    Write-Output "##### pre-deploy hook #####"
    Write-Output "###########################"
}

if (Test-Path .env) {
    Get-Content -Path ".env" `
        | Select-String -Pattern "^[^#]\w+" `
        | ForEach-Object {$_ -replace "`"", ""} `
        | ConvertFrom-String -Delimiter "=" -PropertyNames key, value `
        | ForEach-Object {[Environment]::SetEnvironmentVariable($_.key, $_.value)}
}

if ($TARGET -eq "all" -Or $TARGET -eq "lambda") {
    $ALL_SOURCE_DIRS = Get-Content -Path "skill.json" `
        | Select-String -Pattern "sourceDir" -CaseSensitive `
        | ForEach-Object {$_ -replace ".*:\s*`"([^`"]+)`".*", "`$1" -replace "/", "\"} `
        | Sort `
        | Get-Unique
    Foreach ($SOURCE_DIR in $ALL_SOURCE_DIRS) {
        $CWD = (Get-Location).Path
        if (install_dependencies $CWD $SOURCE_DIR) {
            if ($DO_DEBUG) {
                Write-Output "Codebase ($SOURCE_DIR) built successfully."
            }
        } else {
            if ($DO_DEBUG) {
                Write-Output "There was a problem installing dependencies for ($SOURCE_DIR)."
            }
            exit 1
        }
    }
    if (update_skill_catalog) {
        if ($DO_DEBUG) {
            Write-Output "Skill catalog updated successfully."
        }
    } else {
        if ($DO_DEBUG) {
            Write-Output "There was a problem updating the skill catalog."
        }
        exit 1
    }
    if (update_skill_manifest) {
        if ($DO_DEBUG) {
            Write-Output "Skill manifest updated successfully."
        }
    } else {
        if ($DO_DEBUG) {
            Write-Output "There was a problem updating the skill manifest."
        }
        exit 1
    }
    if ($DO_DEBUG) {
        Write-Output "###########################"
    }
}

exit 0
