const BARCODE_IMAGE_EXTENSION = "png";

export default class BarCodeImageGenerator {

    constructor(barcodesDirectory, barcodeValueMin, barcodeValueMax, barcodeMask = "0000") {
        this.barcodesDirectory = barcodesDirectory;
        this.barcodeValueMin = barcodeValueMin;
        this.barcodeValueMax = barcodeValueMax;
        this.barcodeMask = barcodeMask;
    }

    getRandomBarcodeValueInRange() {
        return this.barcodeValueMin + Math.floor(Math.random() * (this.barcodeValueMax - this.barcodeValueMin));
    }

    generateBarcodeImage = (barcodeValue) => {
        if (barcodeValue < this.barcodeValueMin || barcodeValue > this.barcodeValueMax){
            throw new Error("Barcode value out of range");
        }

        const filename = (this.barcodeMask + barcodeValue).slice(-(this.barcodeMask.length)) + "." + BARCODE_IMAGE_EXTENSION;
        const url = this.barcodesDirectory + "/" + filename;
        return new Image().src = url;
    }
}
