import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import jsPDF from 'jspdf'; // Import jsPDF library
import './QR.css'; // Make sure to create this CSS file

const API_URL = '/pizzas';

const QR = () => {
  const [dogs, setDogs] = useState([]);
  const [qrCodes, setQrCodes] = useState({});
  const [idRange, setIdRange] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch dogs');
      }
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      setError('Error fetching dogs');
      console.error('Error fetching dogs:', error);
    }
  };

  const generateQRCode = async (dogId) => {
    try {
      const qrCode = await QRCode.toDataURL(`http://localhost:3000/dog/${dogId}`);
      return { qrCode };
    } catch (error) {
      setError(`Error generating QR code for dog ID ${dogId}`);
      console.error(`Error generating QR code for dog ID ${dogId}:`, error);
      return null;
    }
  };

  const generateQRCodes = async () => {
    const filteredDogs = dogs.filter(dog => {
      const id = parseInt(dog.id);
      if (!isNaN(id)) {
        if (idRange.includes("-")) {
          const [start, end] = idRange.split("-").map(Number);
          return id >= start && id <= end;
        } else {
          return id === parseInt(idRange);
        }
      }
      return false;
    });

    const codes = {};
    for (const dog of filteredDogs) {
      const qrCodeData = await generateQRCode(dog.id);
      if (qrCodeData) {
        codes[dog.id] = {
          qrCode: qrCodeData.qrCode,
          name: dog.name
        };
      }
    }
    setQrCodes(codes);
  };

  const handleGetQRCodes = () => {
    setError(null);
    generateQRCodes();
  };
  const downloadQRDoc = () => {
    const doc = new jsPDF(); // Create new jsPDF instance
  
    let x = 10; // Initial X coordinate for the first QR code
    let y = 10; // Initial Y coordinate for the first QR code
    const qrCodeWidth = 50; // Width of each QR code image
    const qrCodeHeight = 50; // Height of each QR code image
    const spacing = 5; // Minimal spacing between QR codes
    const maxCols = 5; // Maximum number of QR codes per row
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page
  
    let colCount = 0; // Initialize column count
  
    for (const dogId in qrCodes) {
      if (qrCodes.hasOwnProperty(dogId)) {
        const qrCode = qrCodes[dogId];
        doc.addImage(qrCode.qrCode, 'PNG', x, y, qrCodeWidth, qrCodeHeight); // Add QR code image to PDF
        x += qrCodeWidth + spacing; // Increase X coordinate for the next QR code
        colCount++; // Increment column count
  
        if (colCount >= maxCols) {
          // If reached maximum columns, reset X and increment Y for the next row
          x = 10;
          y += qrCodeHeight + spacing; // Add spacing between rows
          colCount = 0; // Reset column count
  
          // Check if Y exceeds the page height and add a new page if necessary
          if (y + qrCodeHeight > pageHeight - spacing) {
            doc.addPage();
            x = 10; // Reset X coordinate for the new page
            y = 10; // Reset Y coordinate for the new page
          }
        }
      }
    }
  
    doc.save('qrcodes.pdf'); // Save PDF document with all QR codes
  };
  
  return (
    <div>
      <div className="qr-range-input">
        <label htmlFor="idRange">Enter ID Range (e.g., 1-1000):</label>
        <input
          type="text"
          id="idRange"
          value={idRange}
          onChange={(e) => setIdRange(e.target.value)}
        />
        <button onClick={handleGetQRCodes}>Get QR Codes</button>
        <button onClick={downloadQRDoc}>Download QR Codes Doc</button>
      </div>
      <div className="qr-grid">
        {Object.keys(qrCodes).map(dogId => (
          <div key={dogId} className="qr-item">
            <h3>{qrCodes[dogId].name}</h3>
            <img src={qrCodes[dogId].qrCode} alt={`QR Code for ${qrCodes[dogId].name}`} />
          </div>
        ))}
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default QR;
