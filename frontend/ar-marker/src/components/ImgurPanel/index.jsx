import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Alert, Spinner } from 'react-bootstrap';
const { callbackify } = require("util");
import PropTypes from 'prop-types';
import axios from 'axios';
var FormData = require('form-data');

import ImgurLogo from './imgur_logo.png';


export const uploadImage = async (file, clientId) => {
    const data = new FormData();
    data.append("image", file);

    const config = {
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            Authorization: `Client-ID ${clientId}`,
        },
    };
    const response = await axios.post("https://api.imgur.com/3/image", data, config);

    return response.data;
}


const ImgurPanel = (props) => {
    const [alertState, setAlertState] = useState(null);

    const validateDropzoneFiles = (file) => {

        if (props.accept !== undefined){
            const acceptedMimeTypes = props.accept.toLowerCase()
                .replace(/ /g, '')
                .split(',');

                if (!acceptedMimeTypes.includes(file.type)){
                    return { code: "file-invalid-type", message: "Invalid file type"  }
                }
        }

        return null;
    }

    const handleOnDrop = (droppedFiles) => {
        setAlertState(null);
        props.onDrop(droppedFiles);
    }

    const truncateString = (str, maxLength, truncationStr = "...") => {
        if (str.length <= maxLength) {
            return str
        }

        if (str.length > truncationStr.length) {
            return str.substring(0, maxLength - truncationStr.length) + truncationStr
        } else {
            return str.substring(0, maxLength);
        }
    }

    const handleOnDropAccepted = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const filename = file.name;
        const truncatedFilename = truncateString(filename, 20);

        setAlertState({ state: "uploading", message: "Uploading " + truncatedFilename });

        const uploadAsyncFunc = async () => {
            try {
                //const response = await uploadFile(file);
                const response = await uploadImage(file, props.clientId );

                if (response.data.link === undefined){
                    throw new Error("Unexpected error occurred");
                }

                setAlertState({ state: "done", message: `Successfully uploaded ${truncatedFilename}` });
                props.onUploadedFileUrl(response.data.link);
            } catch (error) {
                setAlertState({ state: "error", message: error.message ? error.message : error });
            }
        };

        callbackify(uploadAsyncFunc)(() => { });
    }

    const handleOnDropRejected = (fileRejections) => {
        const error = fileRejections[0].errors[0];
        setAlertState({ state: "error", message: error.message });
    }

    const renderAlert = (alertState) => {
        if (alertState) {
            switch (alertState.state) {
                case 'error':
                    return (<Alert variant='danger'>{alertState.message}</Alert>);
                case 'uploading':
                    return (<Alert variant='info' style={{ display: 'flex', justifyContent: 'space-between' }}>{alertState.message} <Spinner size='sm' animation="border" /></Alert>);
                case 'done':
                    return (<Alert variant='success'>{alertState.message}</Alert>);
            }
        }
    }

    return (
        <div>
            <Dropzone maxFiles={1} maxSize={props.maxFileSize}
                validator={validateDropzoneFiles}
                onDropRejected={handleOnDropRejected}
                onDropAccepted={handleOnDropAccepted}
                onDrop={handleOnDrop} >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()} style={{ backgroundColor: "#fafafa", borderColor: "#e6e6e6", borderStyle: "dashed", borderRadius: 10, padding: "10px", marginBottom: "10px" }}>
                            <input {...getInputProps()} accept={props.accept} multiple={false} />

                            <div>
                                {props.children}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row-reverse', fontSize: '11px' }}>
                                <div>Powered by <img src={ImgurLogo} alt="Imgur" width="35" /></div>
                            </div>

                        </div>
                    </section>
                )}
            </Dropzone>
            <span />
            {renderAlert(alertState)}
        </div>
    );
}

ImgurPanel.propTypes = {
    maxFileSize: PropTypes.number || 20000000,
    accept: PropTypes.string || undefined,
    onDrop: PropTypes.func || undefined,
    onUploadedFileUrl: PropTypes.func || undefined,
    clientId: PropTypes.string || undefined,
    children: PropTypes.any
};

export default ImgurPanel;