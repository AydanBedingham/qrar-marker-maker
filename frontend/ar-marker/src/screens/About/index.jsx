import React from 'react';
import { Button, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';

import 'styles/common.css';

const About = () => {
  return (
    <div className="main">
      <div>
        <h1>
          About
        </h1>

        <h2>
          Terminology
        </h2>
        <ol>
          <li>AR.js <br/>- A Javscript framework for creating web-based Augmented Reality applications. <br/>- AR.js uses webcams and AR markers to position media.</li>
          <br/>
          <li>Number Barcode <br/>- A type of marker used by AR.js. Each Number Barcode visually encodes a specific number value.<br/>- QRAR Markers use Number Barcodes to uniqely identify and position AR content.</li>
          <br/>
          <li>QR Code <br/>- A highly standardized matrix barcode recognized by a wide variety of devices. <br/>- QRAR Markers use QR Codes to direct user devices (like phones) to online services capable of recognizing AR Markers.</li>
          <br/>
          <li>Quiet Zone <br/>- White space around the outside of barcodes that separates it from its sorroundings and improves recognition.</li>
          <br/>
          <li>QRAR Marker <br/>- A combined QR code and embedded Number Barcode, capable of delivering fully featured AR experiences to users without the need to install apps.</li>
        </ol>

        <h2>
          How it works
        </h2>
        <ol>
          <li>Media is uploaded to Imgur<br/></li>
          <li>Barcode image is selected</li>
          <li>ARJS Payload is generated</li>
          <li>Play URL is generated</li>
          <li>Play URL is shortened using TinyURL</li>
          <li>QR Code is generated /w Barcode as an embedded logo</li>
        </ol>

      </div>
    </div>
  );
}

export default About;
