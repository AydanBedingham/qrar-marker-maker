import QRCode from 'easyqrcodejs';
import BarCodeImageGenerator from 'api/BarcodeImageGenerator';
import ShortUrlGenerator from 'api/ShortUrlGenerator';
import {generateUnsignedJwtToken} from 'utils/jwt-util';
import {generateQrarPayload} from 'utils/qrar-payload-util';

const barcodeImageGenerator = new BarCodeImageGenerator(
    process.env.REACT_APP_BARCODES_URI,
    process.env.REACT_APP_BARCODES_VALUE_MIN,
    process.env.REACT_APP_BARCODES_VALUE_MAX,
);

const shortUrlGenerator = new ShortUrlGenerator(process.env.REACT_APP_SHORTEN_URL_SCRIPT_URI);


const generateQrCodeCanvas = (options) => {

    return new Promise((resolve, reject) => {

        const qrSize = options.qrSize;
        const barcodeRatio = options.barcodeRatio;
        const barcodeValue = options.barcodeValue;
        const playUrl = options.playUrl;

        // retrieve barcode image
        const barCodeImage = barcodeImageGenerator.generateBarcodeImage(barcodeValue);
        const barCodeSize = qrSize * barcodeRatio;

        var divElement = document.createElement('div');

        // generate qr code
        const qrcode = new QRCode(divElement, {
            width: qrSize,
            height: qrSize,
            logo: barCodeImage,
            logoWidth: barCodeSize,
            logoHeight: barCodeSize,
            logoBackgroundColor: '#ffffff',
            logoBackgroundTransparent: true
        });

        qrcode.makeCode(playUrl);

        setTimeout(() => {
            resolve(divElement.getElementsByTagName('canvas')[0])
        }, 2000);
    });
}


const generatePlayUrl = async (qrarPayload) => {
    // encode QRAR payload as JWT
    const jwtToken = generateUnsignedJwtToken(qrarPayload);

    // generate play url
    const longPlayUrl = process.env.REACT_APP_PLAY_SCRIPT_URI + "?token=" + jwtToken;

    // shortening play url
    const shortPlayUrl = await shortUrlGenerator.shortenUrl(longPlayUrl);

    // append unique id query param (just use path component of shortened url)
    return shortPlayUrl + "?id=" + shortPlayUrl.substring(shortPlayUrl.lastIndexOf('/') + 1);
}


export default class QrarMarkerGenerator {

    generateQrMarker = async (options) => {

        // select Barcode Value
        const barcodeValue = options.configuration.barcodeValue !== undefined 
            ? options.configuration.barcodeValue
            : barcodeImageGenerator.getRandomBarcodeValueInRange();

        alert("1"+JSON.stringify(options));

        // generate QRAR payload
        const qrarPayload = generateQrarPayload(barcodeValue, options);

        // generate play url for qrar payload
        const playUrl = await generatePlayUrl(qrarPayload);

        // generate Qrar Marker (QR Code with embedded barcode)
        const qrCodeCanvas = await generateQrCodeCanvas({
            qrSize: Number(options.qrSize),
            barcodeRatio: Number(process.env.REACT_APP_QRAR_MARKER_BARCODE_RATIO),
            barcodeValue: barcodeValue,
            playUrl: playUrl
        });

        return {
            markerSrc: qrCodeCanvas.toDataURL('image/png', 1.0),
            playUrl: playUrl,
        }
    }

}