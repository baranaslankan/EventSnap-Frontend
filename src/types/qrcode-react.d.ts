declare module 'react-qr-code' {
  import * as React from 'react';
  const QRCode: React.FC<{
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    bgColor?: string;
    fgColor?: string;
    title?: string;
  }>;
  export default QRCode;
}
