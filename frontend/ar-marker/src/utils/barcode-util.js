export const getBarcodeImageUrl = (barcodeValue) => {
    const filename = ('0000' + barcodeValue).slice(-4) + ".png";
    return process.env.REACT_APP_BARCODES_URI + "/" + filename;
}