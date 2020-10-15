cd '/mnt/c/Users/PeterWest/OneDrive - University of Dundee/Craneware/CranewareQuizzingTeam7/frontend'
rm package-lock.json
cd node_modules/
if ls *.exe >/dev/null  2>&1; then 
	rm -rf node_modules/
fi;
cd '/mnt/c/Users/PeterWest/OneDrive - University of Dundee/Craneware/CranewareQuizzingTeam7/frontend'
npm install
npm run serve