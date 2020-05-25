rem /* XCE1 - (X)ml (C)onsole (E)ditor v(1).0 *\
::CMD //----------\\""=\*\\*//*/=""//----------
@echo off
title %~n0
if "%~1"=="" goto :help
if /i "%~x1"==".%~n0" goto :FC
if /i "%~1"=="-INSTALL" goto :INSTALL
cscript //E:JScript //NOLOGO "%~dpnx0" %*
goto :eof

:FC
cd /D "%~dp1"
cscript //E:JScript //NOLOGO "%~dpnx0" -FC "%~dpnx1"
if not "%errorlevel%"=="0" pause
goto :eof

:INSTALL
echo Installing %~n0 ...
copy /Y "%~dpnx0" "%WINDIR%"
if exist "%WINDIR%\%~nx0" ftype %~n0file="%WINDIR%\%~nx0" "%%1"
if not exist "%WINDIR%\%~nx0" ftype %~n0file="%~dpnx0" "%%1"
assoc .%~n0=%~n0file
echo Installed.
goto :eof

:help
  echo.
  echo.Use: 
  echo.  XCE1 ^<command1^> [^<argument1^> [^<argument2^>]] [^<command2^> ...]
  echo.    or
  echo.  XCE1 [-FC] ^<file^>.XCE1
  echo. 
  echo.Commands: 
  echo.  -FC  ^<file.XCE1^> -- execute XCE1 comand from file, use "con" to read console input stream.
  echo.  [-]FL  ^<file.xml^>  -- load xml-file.
  echo.  [-]FS              -- save xml-file to loaded file name.
  echo.  [-]FSA ^<new.xml^>   -- save xml-file to new file name.
  echo.  -FL2 ^<file.xml^>  -- alternate method load xml-file.
  echo.
  echo.  {SLN^|-N:}  ^<XPath^>     -- select single node use XPath sytax expression.
  echo.  {SLE^|-E:}  ^<name^>      -- select ENVIRONMENT variable name
  echo.  {SLA^|-A:}  ^<name^>      -- select attribute name
  echo.
  echo.  {LD$^|-$=} ^<value^>      -- load value to VARIABLE.
  echo.  {LDA^|-A=} ^<value^>      -- set attribute value.
  echo.  {LDT^|-T=} ^<value^>      -- set text value.
  echo.  {LDE^|-E=} ^<value^>      -- set ENVIRONMENT variable value.
  echo.  {LET^|-==} {$^|A^|T^|E}={$^|A^|T^|E} -- set othet variants.
  echo.
  echo.  [-]NAC ^<newNode^>   -- append CHILD node in to selected.
  echo.  [-]NIB ^<newNode^>   -- insert newNode before selected.
  echo.  [-]NDEL            -- delete selected node.
  echo.  [-]ADEL            -- delete selected attribute.
  echo.
  echo.  [-]IF {N^|!N}       -- if expression true execute {Node^|Not Node}.
  echo.  [-]FI              -- end of if-block.
  echo.  [-]EXIT            -- exit from application.
  echo.  [-]END             -- end of execute comand file.
  echo.
  echo.  -INSTALL         -- install XCE1 in system folder and associate width "*.XCE1" files.
  echo.
  echo.  -NORMALIZE
  echo.  -PRESERVE_WHITE_SPACE{+^|-}
  echo.  -D               -- toggle debug mode.
  echo.  -DN  ^<XPath^>      -- view nodes selected for XPath expression.
  echo.  -DNN             -- toggle enumerate nodes in debug.
  echo.  -DQ{0^|1^|2}       -- use string terminator NONE,['],["] for output.
  echo.  -DOF{+^|-}        -- toogler other out format debuging.
  echo.  -DXML            -- load XML-text selected node to VARIABLE.
  echo.  -DA{+^|-}         -- toggle attibute debuging
  echo.  -DAF             -- define list of output atributes.
  pause
exit /B 1
::JScript //----------\\""=\*/=""//----------
