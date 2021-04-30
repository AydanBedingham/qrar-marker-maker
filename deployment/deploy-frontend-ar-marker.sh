#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
FRONTEND_DIR=$SCRIPT_DIR/../frontend

CLOUDFRONT_DISTRIBUTION_ID=EM3NVC94SPV7F
CLOUDFRONT_DISTRIBUTION_URL=https://d2gcsft32k0v3b.cloudfront.net
BUCKET_NAME=augemented-reality-example

set -e

# clear build directory
rm -r $FRONTEND_DIR/ar-marker/build/ || true

# change to ar-marker
cd $FRONTEND_DIR/ar-marker
npm run build

# sync files to s3 bucket
aws s3 sync $FRONTEND_DIR/ar-marker/build s3://$BUCKET_NAME

# invalidate cloudfront distribution
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*"

# print the distribution url
echo "CloudFront Url: $CLOUDFRONT_DISTRIBUTION_URL"
