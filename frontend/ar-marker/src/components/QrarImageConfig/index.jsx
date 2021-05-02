import React, { useState } from 'react';
import { Accordion, Card, Alert, Button, Collapse, Form, FormControl, Nav, Navbar, NavDropdown, Spinner, Tabs, Tab } from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'styles/common.css';
import ImgurPanel from '../ImgurPanel';
import { bytesToSize } from 'utils/byteUtil';
import validator from 'validator';
import ImageSelectionPanel from './ImageSelectionPanel';
import ImageConfigurationPanel from './ImageConfigurationPanel';

const DEFAULT_MARKER_CONFIG = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: -90, y: 0, z: 0 },
    size: { width: 1, height: 1 },
    display: { opacity:1 },
    barcode: { useCustomBarcodeValue: false, customBarcodeValue: 1}
};

const ValueOrMinMax = (value, min, max) => {
    return Math.max(Math.min(Number(value), Number(max)), Number(min));
}


const QrarImageConfig = (props) => {
    const [imageUrl, setImageUrl] = useState();
    const [configuration, setConfiguration] = useState(DEFAULT_MARKER_CONFIG);

    const createImageMarker = async (imageUrl) => {

        const markerConfiguration = {
            type: 'image',
            imageUrl: imageUrl,
            position: configuration.position,
            rotation: configuration.rotation,
            size: configuration.size,
            opacity: configuration.opacity,
            barcodeValue: configuration.barcode.useCustomBarcodeValue ? configuration.barcode.customBarcodeValue : undefined 
        };

        await props.createMarker(markerConfiguration);
    }

    //<input className="form-control" type="number" id="width" name="width" step="0.01" onChange={event => setSize({ ...size, width: ValueOrMinMax(event.target.value, 0.01, 999) })} value={size.width} />
                            

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