@echo off
setlocal

set "PATH=%PATH%;C:\Program Files\nodejs"
set "NODE_NPM=C:\Program Files\nodejs\npm.cmd"

"%NODE_NPM%" test -- --runInBand
if errorlevel 1 exit /b %errorlevel%

py -3.12 -m py_compile src\core\base_soul.py src\core\google_docs_exporter.py src\core\kanban_manager.py src\run_pipeline.py
if errorlevel 1 exit /b %errorlevel%

echo [OK] Validation passed.
