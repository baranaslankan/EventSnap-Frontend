'use client';

import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Button } from './Button';

interface QRGeneratorProps {
  eventId: string;
  eventTitle: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  eventId,
  eventTitle,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_QR_BASE_URL || 'http://localhost:3000';
  const registrationUrl = `${baseUrl}/guest/${eventId}/register`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = printRef.current?.innerHTML || '';
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${eventTitle}</title>
          <style>
            @page { size: A4; margin: 2cm; }
            body { 
              font-family: Arial, sans-serif; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center;
              min-height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              max-width: 600px;
            }
            h1 { color: #1f2937; margin-bottom: 1rem; }
            p { color: #6b7280; margin-bottom: 2rem; }
            .qr-code { margin: 2rem 0; }
            .url { 
              font-size: 0.875rem; 
              color: #4b5563; 
              word-break: break-all;
              margin-top: 2rem;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div ref={printRef} className="container">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {eventTitle}
        </h1>
        <p className="text-gray-600 mb-6">
          Scan this QR code to register and view your photos
        </p>
        <div className="qr-code flex justify-center">
          <QRCode value={registrationUrl} size={256} />
        </div>
        <p className="url text-sm text-gray-600 mt-6">
          {registrationUrl}
        </p>
      </div>
      <div className="mt-6 flex gap-3">
        <Button onClick={handlePrint} className="flex-1">
          Print QR Code
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(registrationUrl);
            alert('Link copied to clipboard!');
          }}
          variant="secondary"
          className="flex-1"
        >
          Copy Link
        </Button>
      </div>
    </div>
  );
};