@echo off
:: Clear all the previous files and directories
FOR /D /R %%X IN (.\Build) DO RD /S /Q "%%X"
:: Making new directory resetting the structure
mkdir .\Build\assets
mkdir .\Build\glasses
mkdir .\Build\assets\scripts
mkdir .\Build\assets\styles
mkdir .\Build\assets\swfs
:: Clear all the errors
cls
:: Starting up the fresh build..
echo Build Started...
echo ----------------------------------------------------------------------------
echo Copying fonts
@echo off
xcopy .\assets\fonts .\Build\assets\fonts\ /s /e /h /q
if errorlevel 4 goto lowmemory 
if errorlevel 2 goto abort
echo ----------------------------------------------------------------------------
echo Copying images
@echo off
xcopy .\assets\images .\Build\assets\images\ /s /e /h /q
if errorlevel 4 goto lowmemory 
if errorlevel 2 goto abort 
echo ----------------------------------------------------------------------------
echo Copying swf's
@echo off
xcopy .\assets\swfs\*.swf .\Build\assets\swfs\ /s /e /h /q
if errorlevel 4 goto lowmemory 
if errorlevel 2 goto abort
echo ----------------------------------------------------------------------------

echo Copying Glasses
@echo off
xcopy .\glasses\*.png .\Build\glasses\ /s /e /h /q
xcopy .\glasses\*.jpg .\Build\glasses\ /s /e /h /q
if errorlevel 4 goto lowmemory 
if errorlevel 2 goto abort
echo ----------------------------------------------------------------------------

echo Copying HTML
@echo off
copy .\index.html .\Build\index.html
copy .\save.php .\Build\save.php
copy .\share.php .\Build\share.php
copy .\license.txt .\Build\license.txt
echo ----------------------------------------------------------------------------

echo Copying Settings
@echo off
::copy .\assets\Worker.js .\Build\assets\Worker.js
copy .\assets\js\settings.js .\Build\assets\settings.js
copy .\assets\tracking-min.js .\Build\assets\tracking-min.js
copy .\assets\eye-min.js .\Build\assets\eye-min.js
echo ----------------------------------------------------------------------------

echo Merging JS files
copy .\assets\js\*.js .\Build\assets\scripts\app.txt /a /b

echo ----------------------------------------------------------------------------

::uglifyjs .\Build\assets\scripts\app.js -o .\Build\assets\scripts\app.tmp.js
java -jar .\tools\yuicompressor-2.4.2.jar --charset=UTF-8 --type=js .\Build\assets\scripts\app.txt -o .\Build\assets\scripts\app.min.js
del .\Build\assets\scripts\app.txt /q

echo JS compressed - Done
echo ----------------------------------------------------------------------------

goto exit

:lowmemory 
echo Insufficient memory to copy files or 
echo invalid drive or command-line syntax. 
goto exit 

:abort 
echo You pressed CTRL+C to end the copy operation. 
goto exit 

:exit 

:: Press any key to exit
pause