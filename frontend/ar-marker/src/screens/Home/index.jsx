import React, { useState } from 'react';
import QrarImageConfig from 'components/QrarImageConfig';
import QrarMarkerGenerator from 'api/QrarMarkerGenerator';

import 'styles/common.css';
import QrarVideoConfig from 'components/QrarVideoConfig';

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
        <QrarImageConfig createMarker={async (configuration) => await createMarker(configuration)} />

        <hr />
        {(loading && (<span>Loading</span>))}

        {(marker && (
            <div id="output">
                <img src={marker.markerSrc} />
                <br />
                <a href={marker.playUrl} >{marker.playUrl}</a>
            </div>
        ))}

      </div>
    </div>
  );
}

export default Home;