# QRAR Marker Maker

Website that allows users to generate Augmented Reality experiences via QR Codes (QRAR's).

## Experience Highlights
* Allows for click-and-create creation of Augmented Reality QR Codes leveraging the AR.JS Framework.
* Extends the possibilities of AR.JS Augmented Reality experiences by using QR Code scanning to dynamically load content at-runtime.

## Infrastructure Highlights
* ReactJS Single-page Web Application frontend hosted using only CloudFront and S3.
* Deployed using AWS Quick-Create Links in conjunction with CloudFormation Custom Resources (does not require a conventional CI/CD pipeline).

## AWS Quick-Create Link
Quick-Create link for latest stable release.
To Deploy [Click here](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?stackName=qrar&templateURL=https://qrar-releases.s3.amazonaws.com/release/1.00/packaged-template.yaml&param_FrontendArtifactBucketName=qrar-releases&param_FrontendArtifactBucketObject=release/1.00/webapp.zip)
