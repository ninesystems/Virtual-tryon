echo "Deleting the contents of the build folder"
cd Build
rm -rf *
cd ..

echo "----------------------------------------------------------------------------"
echo "making new directories"
mkdir ./Build/assets
mkdir ./Build/glasses
mkdir ./Build/assets/scripts
mkdir ./Build/assets/styles
mkdir ./Build/assets/swfs

echo "Build Started"
echo "----------------------------------------------------------------------------"
echo "Copying images"
cp -r ./assets/images ./Build/assets/images/

echo "----------------------------------------------------------------------------"
echo "Copying swf's"
cp ./assets/swfs/*.swf ./Build/assets/swfs/

echo "----------------------------------------------------------------------------"
echo "Copying Glasses"
cp ./glasses/*.png ./Build/glasses/
cp ./glasses/*.jpg ./Build/glasses/

echo "----------------------------------------------------------------------------"
echo "Copying HTML"
cp ./index.html ./Build/index.html
cp ./save.php ./Build/save.php
cp ./share.php ./Build/share.php

echo "----------------------------------------------------------------------------"
echo "Copying Settings"
cp ./assets/js/settings.js ./Build/assets/settings.js
cp ./assets/tracking-min.js ./Build/assets/tracking-min.js
cp ./assets/eye-min.js ./Build/assets/eye-min.js

echo "----------------------------------------------------------------------------"
echo "Merging JS files"
cat ./assets/js/*.js > ./Build/assets/scripts/app.txt 

echo "----------------------------------------------------------------------------"
# ::uglifyjs ./Build/assets/scripts`/app.js -o ./Build/assets/scripts/app.tmp.js
java -jar ./tools/yuicompressor-2.4.2.jar --charset=UTF-8 --type=js ./Build/assets/scripts/app.txt -o ./Build/assets/scripts/app.min.js
rm ./Build/assets/scripts/app.txt

echo "JS compressed - Done"
echo "----------------------------------------------------------------------------"
