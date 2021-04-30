const BARCODE_IMAGE_EXTENSION = "png";

export default class BarCodeImageGenerator {

    constructor(barcodesDirectory, barcodeValueMin, barCodeValueMax) {
        this.barcodesDirectory = barcodesDirectory;
        this.barcodeValueMin = barcodeValueMin;
        this.barCodeValueMax = barCodeValueMax;
    }

    getRandomBarcodeValueInRange() {
        return this.barcodeValueMin + Math.floor(Math.random() * (this.barCodeValueMax - this.barcodeValueMin));
    }

    generateBarcodeImage = (barcodeValue) => {
        if (barcodeValue < this.barcodeValueMin || barcodeValue > this.barCodeValueMax){
            throw new Error("Barcode value out of range");
        }

        const filename = ('0000' + barcodeValue).slice(-4) + "." + BARCODE_IMAGE_EXTENSION;
        const url = this.barcodesDirectory + "/" + filename;
        return new Image().src = url;
    }
}