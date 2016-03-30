#!/bin/bash

npm i

if [ "$1" = "--dev" ]; then
   IS_DEV=1
fi

# Use the bundle adaviz for now, we will also publish adaviz soon!
if [ ! -f "./build/adaviz.js" ]; then
	(
    mkdir -p build
		cd build
    wget https://s3.amazonaws.com/vddf/adaviz.min.js
    wget https://s3.amazonaws.com/vddf/adaviz.min.css
	)
fi

echo "\nBuilding client side ..."
if [ $IS_DEV ]; then
  webpack --config webpack/client/development.js
else
  webpack --config webpack/client/production.js
fi

#echo "\nBuilding server side ..."
#babel --ignore=browser,webapp,chrome,test src -d build/vddf-server
