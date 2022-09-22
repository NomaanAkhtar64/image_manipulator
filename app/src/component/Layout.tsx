import React from 'react';
import ConditionalRender from './Render';
import Uploader from './Uploader';
interface LayoutProps {
  children?: JSX.Element | string | null;
  name: string;
  onUpload: (image: IMImage) => void;
  hasImage: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  name,
  onUpload,
  hasImage,
  contentRef,
}) => {
  return (
    <div className='w-full h-full lg:px-10  flex justify-center items-start lg:items-center'>
      <div
        className='w-full h-fit py-4 bg-zinc-800 dark:bg-zinc-100 flex flex-col items-center'
        style={{ minHeight: '24 rem' }}
        ref={contentRef}
      >
        <h1
          className='text-zinc-300 dark:text-black text-2xl uppercase font-roboto font-bold'
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
