const generateImageQrarPayload = (options) => {
  const imageUrl = options.imageUrl;
  const qrSize = options.qrSize;
  const barcodeValue = options.barcodeValue;
  const barcodeQuietZone = options.barcodeQuietZone;
  const barcodeSize = qrSize * options.barcodeRatio;
  const config = options.configuration;

  const scalingFactor = (1 + barcodeQuietZone) * (qrSize / barcodeSize);

  const applyScaling = (value) => {
    return (value * scalingFactor).toFixed(3);
  };

  return {
    markers: [
      {
        element: "a-marker",
        type: "barcode",
        value: barcodeValue,
        children: [
          {
            element: "a-plane",
            opacity: Number(config.opacity).toFixed(3),
            src: imageUrl,
            position: `${applyScaling(config.position.x)} ${applyScaling(
              config.position.y
            )} ${applyScaling(config.position.z)}`,
            rotation: `${config.rotation.x} ${config.rotation.y} ${config.rotation.z}`,
            width: applyScaling(config.size.width),
            height: applyScaling(config.size.height),
          },
        ],
      },
    ],
  };
};

const generateVideoQrarPayload = (options) => {
  const videoUrl = options.videoUrl;
  const qrSize = options.qrSize;
  const barcodeValue = options.barcodeValue;
  const barcodeQuietZone = options.barcodeQuietZone;
  const barcodeSize = qrSize * options.barcodeRatio;
  const config = options.configuration;

  const scalingFactor = (1 + barcodeQuietZone) * (qrSize / barcodeSize);

  const applyScaling = (value) => {
    return (value * scalingFactor).toFixed(3);
  };

  return {
    markers: [
      {
        element: "a-marker",
        type: "barcode",
        value: barcodeValue,
        children: [
          {
            element: "a-video",
            opacity: Number(config.opacity).toFixed(3),
            src: videoUrl,
            position: `${applyScaling(config.position.x)} ${applyScaling(
              config.position.y
            )} ${applyScaling(config.position.z)}`,
            rotation: `${config.rotation.x} ${config.rotation.y} ${config.rotation.z}`,
            width: applyScaling(config.size.width),
            height: applyScaling(config.size.height),
          },
        ],
      },
    ],
  };
};

export const generateQrarPayload = (barcodeValue, options) => {
  switch (options.configuration.type) {
    case "image":
      return generateImageQrarPayload({
        qrSize: Number(options.qrSize),
        imageUrl: options.configuration.imageUrl,
        configuration: options.configuration,
        barcodeRatio: Number(process.env.REACT_APP_QRAR_MARKER_BARCODE_RATIO),
        barcodeQuietZone: Number(process.env.REACT_APP_BARCODES_QUIET_ZONE),
        barcodeValue: barcodeValue,
      });

    case "video":
      return generateVideoQrarPayload({
        qrSize: Number(options.qrSize),
        videoUrl: options.configuration.videoUrl,
        configuration: options.configuration,
        barcodeRatio: Number(process.env.REACT_APP_QRAR_MARKER_BARCODE_RATIO),
        barcodeQuietZone: Number(process.env.REACT_APP_BARCODES_QUIET_ZONE),
        barcodeValue: barcodeValue,
      });
    default:
      throw new Error("Unrecognised Qrar Type!");
  }
};
