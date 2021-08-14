import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'styles/common.css';
import ImageSelectionPanel from './ImageSelectionPanel';
import ImageConfigurationPanel from './ImageConfigurationPanel';

const DEFAULT_MARKER_CONFIG = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: -90, y: 0, z: 0 },
    opacity: 1,
    size: { width: 1, height: 1 },
    display: { opacity:1 },
    barcode: { useCustomBarcodeValue: false, customBarcodeValue: 1}
};

const QrarImageConfig = (props) => {
    const [imageUrl, setImageUrl] = useState();
    const [configuration, setConfiguration] = useState(DEFAULT_MARKER_CONFIG);

    const createImageMarker = async (imageUrl) => {

        const markerConfiguration = {
            ...configuration,
            type: 'image',
            imageUrl: imageUrl,
            barcodeValue: configuration.barcode.useCustomBarcodeValue ? configuration.barcode.customBarcodeValue : undefined 
        };

        await props.createMarker(markerConfiguration);
    }

    return (
        <div>
            <h3>Select Media:</h3>
            <ImageSelectionPanel imageUrl={imageUrl} setImageUrl={setImageUrl} />
            
            <h3>Configuration:</h3>
            <ImageConfigurationPanel configuration={configuration} setConfiguration={setConfiguration} />            

            <br />
            <br />
            <Button type="button" className="btn btn-primary" disabled={(imageUrl === undefined)} onClick={async () => await createImageMarker(imageUrl)}>Generate Marker</Button>
        </div>
    );
}

QrarImageConfig.propTypes = {
    createMarker: PropTypes.func
};

export default QrarImageConfig;