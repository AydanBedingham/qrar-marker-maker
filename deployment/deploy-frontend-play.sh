#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
FRONTEND_DIR=$SCRIPT_DIR/../frontend

CLOUDFRONT_DISTRIBUTION_ID=EM3NVC94SPV7F
CLOUDFRONT_DISTRIBUTION_URL=https://d2gcsft32k0v3b.cloudfront.net
BUCKET_NAME=augemented-reality-example-play

TEMP_DIR=/tmp/qrar/frontend

set -e

# clear temp directory
rm -r $TEMP_DIR/* || true
mkdir -p $TEMP_DIR

# copy play page to temp directory
cp -r $FRONTEND_DIR/play/* $TEMP_DIR/

# unzip barcodes to temp directory
mkdir -p $TEMP_DIR/barcodes
unzip $FRONTEND_DIR/barcodes.zip -d $TEMP_DIR/barcodes

# sync files to s3 bucket
aws s3 sync $TEMP_DIR s3://$BUCKET_NAME/play

# invalidate cloudfront distribution
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/play/*"

# print the distribution url
echo "CloudFront Url: $CLOUDFRONT_DISTRIBUTION_URL/play"
