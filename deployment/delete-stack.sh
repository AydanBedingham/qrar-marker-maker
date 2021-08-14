#!/bin/bash
# command: ./delete-stack.sh <REGION> <STACK_NAME>
# example: ./delete-stack.sh us-east-1 qrar12

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
TEMP_DIR=$(mktemp -d -t ci-XXXXXXXXXX)

# missing parameters, show help
[ $# -le 1 ] && echo "Usage: $0 region stackName" && exit 1

# get region from argument 1
Region=$1

# get stackname from argument 2
StackName=$2

# perform delete operation
aws cloudformation wait stack-delete-complete \
    --region $Region \
    --stack-name $StackName

# wait for delete operation to complete
aws cloudformation wait stack-delete-complete \
    --region $Region \
    --stack-name $StackName

echo "Done"
