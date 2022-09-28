import { useAutoAnimate } from '@formkit/auto-animate/react';
import React from 'react';
import ConditionalRender from './Render';
import Uploader from './Uploader';

interface LayoutProps {
  children?: JSX.Element | string | null;
  name: string;
  onUpload: (image: IMImage) => void;
  hasImage: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  name,
  onUpload,
  hasImage,
}) => {
  const [contentRef] = useAutoAnimate<HTMLDivElement>({
    duration: 300,
  });
  return (
    <div className='w flex h-full w-full items-start justify-center overflow-hidden lg:items-center lg:px-10'>
      <div
        className='flex h-fit w-full flex-col items-center  bg-zinc-200 py-4 dark:bg-zinc-800'
        style={{ minHeight: '24 rem' }}
        ref={contentRef}
      >
        <h1
          className='font-roboto text-2xl font-bold uppercase text-teal-700'
          style={{ letterSpacing: '20px' }}
        >
          {name}
        </h1>
        <ConditionalRender
          condition={hasImage}
          onTrue={<>{children}</>}
          onFalse={<Uploader onUpload={onUpload} />}
        />
      </div>
    </div>
  );
};

export default Layout;

