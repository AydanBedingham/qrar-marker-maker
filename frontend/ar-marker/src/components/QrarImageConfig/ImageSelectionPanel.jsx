import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'styles/common.css';
import ImgurPanel from '../ImgurPanel';
import { bytesToSize } from 'utils/byteUtil';
import validator from 'validator';

const maxFileSize = 20000000; // 20 MB

const ImageSelectionPanel = (props) => {
    const [key, setKey] = useState('upload');

    return (
        <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey="upload" title="Upload">
                <br />
                <ImgurPanel 
                    clientId={process.env.REACT_APP_IMGUR_CLIENT_ID}
                    accept={"image/png, image/jpeg, image/gif"}
                    maxFileSize={maxFileSize}
                    onDrop={()=>{props.setImageUrl(undefined)}} 
                    onUploadedFileUrl={(filename)=>props.setImageUrl(filename)}>
                    <p>Drag and drop a file into this area or click to select a file</p>
                    <ul>
                        <li>Supported file types: PNG, JPEG, GIF</li>
                        <li>Max filesize: {bytesToSize(maxFileSize)}</li>
                    </ul>
                </ImgurPanel>
            </Tab>
            <Tab eventKey="url" title="Specify Url">
                <br />
                <div className="input-group">
                    <div className="input-group-prepend"><span className="input-group-text" id="">Image Url:</span></div>
                    <input
                        type="text" id="customUrl" name="customUrl" 
                        className={ (props.imageUrl !== undefined && validator.isURL(props.imageUrl))  ? "form-control is-valid" : "form-control is-invalid"}
                        onChange={event => props.setImageUrl(event.target.value)} value={props.imageUrl} />
                </div>
                <br />
            </Tab>
        </Tabs>
    );
}

ImageSelectionPanel.propTypes = {
    imageUrl: PropTypes.string || "",
    setImageUrl: PropTypes.func || undefined,

};

export default ImageSelectionPanel;