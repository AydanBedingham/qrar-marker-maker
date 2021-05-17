#!/bin/bash
set -e

if [ -n "$1" ]; then
  OUTPUT_FILE=$1
else
    echo "Expected output file location"
    exit
fi

TEMP_DIR=$(mktemp -d -t ci-XXXXXXXXXX)

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
FRONTEND_DIR=$SCRIPT_DIR/../frontend

# build ar-marker project
cd $FRONTEND_DIR/ar-marker
rm -r $FRONTEND_DIR/ar-marker/build/ || true
npm run build

# copy ar-marker build files to temp directory
cp -r "$FRONTEND_DIR/ar-marker/build/" "$TEMP_DIR/"

# copy play page to temp directory
mkdir -p "$TEMP_DIR/play"
cp -r "$FRONTEND_DIR/play/" "$TEMP_DIR/play"

# unzip barcodes to temp directory
mkdir -p $TEMP_DIR/play/barcodes
unzip $FRONTEND_DIR/barcodes.zip -d $TEMP_DIR/play/barcodes

# zip contents of temp directory
cd $TEMP_DIR
zip -r "$OUTPUT_FILE" "./"

# cleanup the temp directory
rm -r "$TEMP_DIR" || true

echo $TEMP_DIR/webapp.zip