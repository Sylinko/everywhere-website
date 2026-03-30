import React from 'react';
import Image from 'next/image';

interface HorizontalImgProps {
  src: string;
  alt: string;
  width?: string;
}

export const HorizontalImg: React.FC<HorizontalImgProps> = ({
  src,
  alt,
  width = '100%',
}) => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        style={{ width, height: 'auto', borderRadius: '0.5rem' }}
      />
    </div>
  );
};
