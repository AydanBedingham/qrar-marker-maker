import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'styles/common.css';

const ValueOrMinMax = (value, min, max) => {
    return Math.max(Math.min(Number(value), Number(max)), Number(min));
}

const ImageConfigurationPanel = (props) => {

    return (
        <Accordion defaultActiveKey="-1">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        Size
                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <div className="input-group">
                                
                                <div className="input-group-prepend"><span className="input-group-text" id="">Width:</span></div>
                                <input className="form-control" type="number" id="width" name="width" step="0.01" 
                                    value={props.configuration.size.width}
                                    onChange={event => props.setConfiguration({...props.configuration, size:{...props.configuration.size, width:ValueOrMinMax(event.target.value, 0.01, 999)}})} />
                                
                                <div className="input-group-prepend"><span className="input-group-text" id="">Height:</span></div>
                                <input className="form-control" type="number" id="width" name="height" step="0.01"
                                    value={props.configuration.size.height}
                                    onChange={event => props.setConfiguration({...props.configuration, size:{...props.configuration.size, height:ValueOrMinMax(event.target.value, 0.01, 999)}})} />
                            
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
                                <input className="form-control" type="number" id="positionX" name="positionX" step="0.01"
                                    value={props.configuration.position.x}
                                    onChange={event => props.setConfiguration({...props.configuration, position:{...props.configuration.position, x:ValueOrMinMax(event.target.value, -999, 999)}})} />
                                
                                <div className="input-group-prepend"><span className="input-group-text" id="">Y:</span></div>
                                <input className="form-control" type="number" id="positionY" name="positionY" step="0.01"
                                    value={props.configuration.position.y}
                                    onChange={event => props.setConfiguration({...props.configuration, position:{...props.configuration.position, y:ValueOrMinMax(event.target.value, -999, 999)}})} />
                                
                                <div className="input-group-prepend"><span className="input-group-text" id="">Z:</span></div>
                                <input className="form-control" type="number" id="positionZ" name="positionZ" step="0.01"
                                    value={props.configuration.position.z}
                                    onChange={event => props.setConfiguration({...props.configuration, position:{...props.configuration.position, z:ValueOrMinMax(event.target.value, -999, 999)}})} />

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
                                <input className="form-control" type="number" id="rotationX" name="rotationX" step="0.01"
                                    value={props.configuration.rotation.x}
                                    onChange={event => props.setConfiguration({...props.configuration, rotation:{...props.configuration.rotation, x:ValueOrMinMax(event.target.value, -999, 999)}})} />
                                
                                <div className="input-group-prepend"><span className="input-group-text" id="">Y:</span></div>
                                <input className="form-control" type="number" id="rotationY" name="rotationY" step="0.01"
                                    value={props.configuration.rotation.y}
                                    onChange={event => props.setConfiguration({...props.configuration, rotation:{...props.configuration.rotation, y:ValueOrMinMax(event.target.value, -999, 999)}})} />
                                
                                <div className="input-group-prepend"><span className="input-group-text" id="">Z:</span></div>
                                <input className="form-control" type="number" id="rotationZ" name="rotationZ" step="0.01"
                                    value={props.configuration.rotation.z}
                                    onChange={event => props.setConfiguration({...props.configuration, rotation:{...props.configuration.rotation, z:ValueOrMinMax(event.target.value, -999, 999)}})} />

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
                                <input className="form-control" type="number" id="opacity" name="opacity" step="0.01"
                                    value={props.configuration.display.opacity}
                                    onChange={event => props.setConfiguration({...props.configuration, display:{...props.configuration.rotation, opacity:ValueOrMinMax(event.target.value, 0, 1)}})} />

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
                                        <input type="checkbox" id="barcodeValueCustom" name="barcodeType" 
                                            checked={props.configuration.barcode.useCustomBarcodeValue}
                                            onChange={event => props.setConfiguration({...props.configuration, barcode:{...props.configuration.barcode, useCustomBarcodeValue: !props.configuration.barcode.useCustomBarcodeValue}})} />
                                        <span>Custom Value:</span>
                                    </div>
                                </div>
                                <input className="form-control" type="number" id="barcodeValue" name="barcodeValue" step="1"
                                    disabled={!props.configuration.barcode.useCustomBarcodeValue}
                                    value={props.configuration.barcode.customBarcodeValue}
                                    onChange={event => props.setConfiguration({...props.configuration, barcode:{...props.configuration.barcode, customBarcodeValue:ValueOrMinMax(event.target.value, process.env.REACT_APP_BARCODES_VALUE_MIN, process.env.REACT_APP_BARCODES_VALUE_MAX)}})} />
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
    );
}

ImageConfigurationPanel.propTypes = {
    configuration: PropTypes.any,
    setConfiguration: PropTypes.func || undefined,

};

export default ImageConfigurationPanel;