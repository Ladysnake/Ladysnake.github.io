@echo off
echo This requires Python 3 to be installed in order to run.
echo Auto IP detection might not work on older devices. Sorry!
if [%1] equ [localhost] goto :localhost
if [%1] equ [127.0.0.1] goto :localhost
if [%1] equ [::] goto :localhost
if [%1] neq [] goto :neq

set ip_address_string="IPv4 Address"
for /f "usebackq tokens=2 delims=:" %%f in (`ipconfig ^| findstr /c:%ip_address_string%`) do (
    set foundip=%%f
    goto :runHere
)
:runHere
echo Using assumed IP address %foundip%
echo If you are unable to access this site from other computers on the LAN,
echo please find the correct IP with ipconfig and add that to the command instead.
python -m http.server 80 --bind%foundip%
goto :eof

:neq
echo Using provided IP address %1
echo 
python -m http.server 80 --bind %1
goto :eof

:localhost
echo Using localhost. You will not be able to access
echo the page from other devices on the network.
python -m http.server 80
goto :eof

:eof