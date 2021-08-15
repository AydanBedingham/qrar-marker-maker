#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# check for missing parameters
if [ $# -ne 5 ]
then
    echo "Invalid parameters"
    echo "Usage: $0 <Region> <Action> <ArtifactBucketName> <ArtifactBucketPrefix> <StackName>"
    echo "Example: $0 us-east-1 c temp-bucket123456 release/1.03 qrar"
    exit 1
fi


Region=$1
Act=$2
ArtifactBucketName=$3
ArtifactBucketPrefix=$4
StackName=$5

$SCRIPT_DIR/build-stack.sh $Region $ArtifactBucketName $ArtifactBucketPrefix
$SCRIPT_DIR/deploy-stack.sh $Region $Act $ArtifactBucketName $ArtifactBucketPrefix $StackName
