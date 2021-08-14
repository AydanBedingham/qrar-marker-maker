import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import QrarImageConfig from 'components/QrarImageConfig';
import QrarMarkerGenerator from 'api/QrarMarkerGenerator';

import 'styles/common.css';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState(null);

  const qrarMarkerGenerator = new QrarMarkerGenerator();

  const createMarker = async (configuration) => {
    setMarker(null);
    setLoading(true);

    const options = {
      qrSize: process.env.REACT_APP_QRAR_MARKER_TARGET_SIZE,
      configuration: configuration
    };

    const marker = await qrarMarkerGenerator.generateQrMarker(options);

    setMarker(marker);
    setLoading(false);
  }


  return (
    <div className="main">
      <div>
        <h1>
          Home
        </h1>

        {(loading && (<span>Loading</span>))}

        {((!loading && !marker) && (
          <div style={{width:'450px'}}>
          <QrarImageConfig createMarker={async (configuration) => await createMarker(configuration)} /> 
          </div>
        ))}

        {((!loading && marker) && (
          <div>
            <Button type="button" className="btn btn-primary" onClick={async () => setMarker(null)}>Reset</Button>
            <hr />
            <div id="output">
                <img height={450} width={450} src={marker.markerSrc} />
                <br />
                <a target="_blank" rel='noreferrer' href={marker.playUrl} >{marker.playUrl}</a>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Home;