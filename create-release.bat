@echo off
if "%~1"=="" (
  echo Version TAG nicht angegeben!
  echo.
  echo Bitte als paramenter angeben. z.B. v6.0.0-beta4
  echo Benutze den Befehl 'git tag' zum Anzeigen der verfuegbaren TAGs
  pause
  exit 1
) 

FOR /F "tokens=*" %%a in ('git branch --show-current') do SET CURBR=%%a

echo TAG %1 wird ausgecheckt...
git checkout %1
if "%ERRORLEVEL%" == "1" (
  echo Fehler beim Auschecken des TAGs %1. Bitte pruefen!
  pause
  exit 1
)
echo Submodule werden aktualisiert
git submodule update --init --recursive
if "%ERRORLEVEL%" == "1" (
  echo Fehler beim aktualisieren der Submodule. Bitte pruefen!
  pause
  exit 1
)

echo.
echo BITS Release wird in den Verzeichnissen '..\BITS-%1-webroot' erstellt...
hugo --cleanDestinationDir --destination ..\BITS-%1-webroot
if "%ERRORLEVEL%" == "1" (
  echo Fehler beim Erstellen der 'webroot' Version. Bitte pruefen!
  pause
  exit 1
)  
del ..\BITS-%1-webroot\CNAME

echo.
echo Komprimiere BITS-%1-webroot
"c:\Program Files\7-Zip\7z.exe" -tzip a ..\BITS-%1-webroot.zip ..\BITS-%1-webroot\*
if "%ERRORLEVEL%" == "1" (
  echo Fehler beim komprimieren der 'webroot' Version. Bitte pruefen!
  pause
  exit 1
)  
rd /s/q ..\BITS-%1-webroot\

echo.
echo BITS Release wird in den Verzeichnissen '..\BITS-%1-fileshare' erstellt...
hugo --environment html --cleanDestinationDir --destination ..\BITS-%1-fileshare
if "%ERRORLEVEL%" == "1" (
  echo "Fehler beim Erstellen der 'fileshare' Version. Bitte pruefen!"
  pause
  exit 1
)  
del ..\BITS-%1-fileshare\CNAME

echo.
echo Komprimiere BITS-%1-fileshare
"c:\Program Files\7-Zip\7z.exe" -tzip a ..\BITS-%1-fileshare.zip ..\BITS-%1-fileshare\*
if "%ERRORLEVEL%" == "1" (
  echo Fehler beim komprimieren der 'fileshare' Version. Bitte pruefen!
  pause
  exit 1
)  
rd /s/q ..\BITS-%1-fileshare\

echo.
echo erstelle MD5SUM Hashes
md5sum ../BITS-*.zip >..\BITS-%1.md5
if "%ERRORLEVEL%" == "1" (
  echo Fehler beim erstellen der MD5SUM. Bitte pruefen!
  pause
)

echo "vorheriger Branch %CURBR% wird wieder ausgecheckt..."
git checkout %CURBR%
echo Submodule werden auf alten stand gebracht.
git submodule update --init --recursive
if "%ERRORLEVEL%" == "1" (
  echo Fehler beim aktualisieren der Submodule. Bitte pruefen!
  pause
)

echo.
echo fertig.
