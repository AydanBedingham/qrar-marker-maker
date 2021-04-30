import React, { useState } from 'react';
import { Accordion, Card, Alert, Button, Collapse, Form, FormControl, Nav, Navbar, NavDropdown, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'styles/common.css';
import ImgurPanel from '../ImgurPanel';

const DEFAULT_MARKER_CONFIG = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: -90, y: 0, z: 0 },
    size: { width: 1, height: 1 },
    opacity: 1,
    useRandomBarcodeValue: true,
    customBarcodeValue: 1
};

const ValueOrMinMax = (value, min, max) => {
    return Math.max(Math.min(Number(value), Number(max)), Number(min));
}

const QrarVideoConfig = (props) => {
    const [videoUrl, setVideoUrl] = useState(null);
    const [position, setPosition] = useState(DEFAULT_MARKER_CONFIG.position);
    const [rotation, setRotation] = useState(DEFAULT_MARKER_CONFIG.rotation);
    const [size, setSize] = useState(DEFAULT_MARKER_CONFIG.size);
    const [opacity, setOpacity] = useState(DEFAULT_MARKER_CONFIG.opacity);
    const [useRandomBarcodeValue, setUseRandomBarcodeValue] = useState(DEFAULT_MARKER_CONFIG.useRandomBarcodeValue);
    const [customBarcodeValue, setCustomBarcodeValue] = useState(DEFAULT_MARKER_CONFIG.customBarcodeValue);

    const createVideoMarker = async (videoUrl) => {
        alert("videoUrl:"+videoUrl);

        const configuration = {
            type: 'video',
            videoUrl: videoUrl,
            position: position,
            rotation: rotation,
            size: size,
            opacity: opacity,
            barcodeValue: useRandomBarcodeValue === true ? undefined : customBarcodeValue
        };

        alert("4"+JSON.stringify(configuration));
        await props.createMarker(configuration);
    }

    const resetInputs = () => {
        setPosition(DEFAULT_MARKER_CONFIG.position);
        setRotation(DEFAULT_MARKER_CONFIG.rotation);
        setSize(DEFAULT_MARKER_CONFIG.size);
        setOpacity(DEFAULT_MARKER_CONFIG.opacity);
        setUseRandomBarcodeValue(DEFAULT_MARKER_CONFIG.useRandomBarcodeValue);
        setCustomBarcodeValue(DEFAULT_MARKER_CONFIG.customBarcodeValue);
    }

    return (
        <div>

            <h3>Video Configuration:</h3>
            <Accordion defaultActiveKey="-1" style={{ maxWidth: "400px" }}>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        Size
                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <div className="input-group">
                                <div className="input-group-prepend"><span className="input-group-text" id="">Width:</span></div>
                                <input className="form-control" type="number" id="width" name="width" step="0.01" onChange={event => setSize({ ...size, width: ValueOrMinMax(event.target.value, 0.01, 999) })} value={size.width} />
                                <div className="input-group-prepend"><span className="input-group-text" id="">Height:</span></div>
                                <input className="form-control" type="number" id="width" name="height" step="0.01" onChange={event => setSize({ ...size, height: ValueOrMinMax(event.target.value, 0.01, 999) })} value={size.height} />
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        Position
                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <div className="input-group">
                                <div className="input-group-prepend"><span className="input-group-text" id="">X:</span></div>
                                <input className="form-control" type="number" id="positionX" name="positionX" step="0.01" onChange={event => setPosition({ ...position, x: ValueOrMinMax(event.target.value, -999, 999) })} value={position.x} />
                                <div className="input-group-prepend"><span className="input-group-text" id="">Y:</span></div>
                                <input className="form-control" type="number" id="positionY" name="positionY" step="0.01" onChange={event => setPosition({ ...position, y: ValueOrMinMax(event.target.value, -999, 999) })} value={position.y} />
                                <div className="input-group-prepend"><span className="input-group-text" id="">Z:</span></div>
                                <input className="form-control" type="number" id="positionZ" name="positionZ" step="0.01" onChange={event => setPosition({ ...position, z: ValueOrMinMax(event.target.value, -999, 999) })} value={position.z} />
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                        Rotation
                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <div className="input-group">
                                <div className="input-group-prepend"><span className="input-group-text" id="">X:</span></div>
                                <input className="form-control" type="number" id="rotationX" name="positionX" step="0.01" onChange={event => setRotation({ ...rotation, x: ValueOrMinMax(event.target.value, -999, 999) })} value={rotation.x} />
                                <div className="input-group-prepend"><span className="input-group-text" id="">Y:</span></div>
                                <input className="form-control" type="number" id="rotationY" name="positionY" step="0.01" onChange={event => setRotation({ ...rotation, y: ValueOrMinMax(event.target.value, -999, 999) })} value={rotation.y} />
                                <div className="input-group-prepend"><span className="input-group-text" id="">Z:</span></div>
                                <input className="form-control" type="number" id="rotationZ" name="positionZ" step="0.01" onChange={event => setRotation({ ...rotation, z: ValueOrMinMax(event.target.value, -999, 999) })} value={rotation.z} />
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="3">
                        Display
                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="3">
                        <Card.Body>
                            <div className="input-group">
                                <div className="input-group-prepend"><span className="input-group-text" id="">Opacity:</span></div>
                                <input className="form-control" type="number" id="opacity" name="opacity" step="0.01" onChange={event => setOpacity(ValueOrMinMax(event.target.value, 0, 1))} value={opacity} />
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="4">
                        Barcode
                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="4">
                        <Card.Body>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">
                                        <input type="checkbox" id="barcodeValueCustom" name="barcodeType" onChange={event => setUseRandomBarcodeValue(!useRandomBarcodeValue)} checked={!useRandomBarcodeValue} />
                                        <span>Custom Value:</span>
                                    </div>
                                </div>
                                <input className="form-control" disabled={useRandomBarcodeValue} type="number" id="barcodeValue" name="barcodeValue" step="1" onChange={event => setCustomBarcodeValue(ValueOrMinMax(event.target.value, process.env.REACT_APP_BARCODES_VALUE_MIN, process.env.REACT_APP_BARCODES_VALUE_MAX))} value={customBarcodeValue} />
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>

            <br />
            <br />
            <Button type="button" className="btn btn-primary" disabled={(videoUrl === null)} onClick={async () => await createVideoMarker(videoUrl)}>Generate Marker</Button>
        </div>
    );
}

QrarVideoConfig.propTypes = {
    createMarker: PropTypes.func
};

export default QrarVideoConfig;