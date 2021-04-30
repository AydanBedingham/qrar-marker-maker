#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKEND_DIR=$SCRIPT_DIR/../backend
TEMP_DIR=/tmp/qrar/backend
TEMP_SHORTEN_URL_ZIP=su.zip

set -e

# clear temp directory
rm -r $TEMP_DIR/* || true
mkdir -p $TEMP_DIR

# change to shorten-url
cd $BACKEND_DIR/shorten-url

# retrieve all npm dependencies
npm clean-install

# zip up source code and dependencies
zip -r $TEMP_DIR/$TEMP_SHORTEN_URL_ZIP .

#
cd $TEMP_DIR
aws lambda update-function-code --function-name generate-qrcode --zip-file fileb://$TEMP_SHORTEN_URL_ZIP
