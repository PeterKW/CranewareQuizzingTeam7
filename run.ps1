if((get-process "ngrok" -ea SilentlyContinue) -eq $Null)
{
  start powershell "cd ./backend
  ./ngrok.exe http 5000"
}

if((get-process "node" -ea SilentlyContinue) -eq $Null)
{
  start powershell "cd ./frontend
  npm run serve"
}

cd ./backend
node applet.js
