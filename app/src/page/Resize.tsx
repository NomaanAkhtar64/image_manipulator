import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useEffect, useRef, useState } from 'react';
import { ImageAPI } from '../api/image';
import Layout from '../component/Layout';
import { useWindowSize } from '../hooks/useWindowSize';
import { conditionalStyle } from '../utils';

function useMaxSize(image: IMImage): {
  width: number;
  height: number;
} {
  let aspectRatio = image.w / image.h;
  const win = useWindowSize();

  const [maxWidth, setMaxWidth] = useState(600);
  const [maxHeight, setMaxHeight] = useState(600 * (image.h / image.w));

  useEffect(() => {
    if (win.width >= 1024) {
      // lg
      let w = Math.min(win.width - 500, 900);
      setMaxWidth(w);
      setMaxHeight(Math.round(w / aspectRatio));
    } else if (win.width >= 768) {
      // md
      setMaxWidth(700);
      setMaxHeight(Math.round(700 / aspectRatio));
    } else if (win.width >= 640) {
      // sm
      setMaxWidth(600);
      setMaxHeight(Math.round(600 / aspectRatio));
    } else {
      // Default
      let PADDING = 6;
      let width = win.width - PADDING * 2;
      let mHeight = Math.round(width / aspectRatio);
      if (mHeight < win.height) {
        setMaxWidth(width);
        setMaxHeight(mHeight);
      } else {
        setMaxWidth(Math.round(win.height * aspectRatio));
        setMaxHeight(win.height);
      }
    }
  }, [win.width, win.height]);

  return {
    width: maxWidth,
    height: maxHeight,
  };
}

interface EditorProps {
  image: IMImage;
}

function Editor({ image }: EditorProps) {
  const aspectRatio = image.w / image.h;
  const [widthPercent, setWidthPercent] = useState(1); // percent
  const [heightPercent, setHeightPercent] = useState(1); // percent
  const max = useMaxSize(image); // maximum image size of viewer (not the actual image)
  const width = Math.round(widthPercent * max.width); // maximum image size of selected region in viewer
  const height = Math.round(heightPercent * max.height);
  const actualWidth = Math.round(image.w * widthPercent); // actual size
  const actualHeight = Math.round(image.h * heightPercent);

  let topRef = useRef(0);
  let leftRef = useRef(0);
  const downloaderRef = useRef<HTMLAnchorElement>(null);

  const [isLocked, setIsLocked] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  function onMouseDown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!isDragging && buttonRef.current) {
      let { top, left } = buttonRef.current.getBoundingClientRect();
      if (widthPercent === 1 && heightPercent === 1) {
        topRef.current = top;
        leftRef.current = left;
      }
      setIsDragging(true);
    }
  }
  console.log(image);

  useEffect(() => {
    function onMouseUp(e: MouseEvent) {
      setIsDragging(false);
    }
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (
        isDragging &&
        buttonRef.current &&
        imageRef.current &&
        bgRef.current
      ) {
        const { offsetX, offsetY } = e;
        let el = e.target as HTMLElement;
        let { top, left } = el.getBoundingClientRect();

        let newWidth = left + max.width - leftRef.current + offsetX;
        let newHeight = top + offsetY - topRef.current;
        newHeight = Math.max(newHeight, 0);
        newHeight = Math.min(newHeight, max.height);

        newWidth = Math.max(newWidth, 0);
        newWidth = Math.min(newWidth, max.width);

        let widthPercent = newWidth / max.width;
        let heightPercent = (max.height - newHeight) / max.height;
        if (isLocked) {
          if (widthPercent >= heightPercent) {
            setWidthPercent(widthPercent);
            setHeightPercent(widthPercent);
          } else {
            setWidthPercent(heightPercent);
            setHeightPercent(heightPercent);
          }
        } else {
          setWidthPercent(widthPercent);
          setHeightPercent(heightPercent);
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isDragging, max.width, max.height, isLocked]);
  return (
    <div
      className='image-viewer flex flex-col lg:flex-row mx-auto py-4'
      data-aspectratio={aspectRatio}
    >
      <div className='relative'>
        <div
          ref={bgRef}
          style={{
            width: max.width,
            height: max.height,
            background: `url("${image.url}")`,
            WebkitFilter: 'blur(8px)',
            filter: 'blur(8px)',
            backgroundSize: `${max.width}px ${max.height}px`,
          }}
        />
        <div className='content absolute left-0 bottom-0 outline outline-4 outline-blue-500'>
          <img
            ref={imageRef}
            style={{
              width,
              height,
            }}
            src={image.url}
          />
          <div className='relative'></div>
        </div>
        <button
          className='absolute z-10 bg-blue-600'
          ref={buttonRef}
          onMouseDown={onMouseDown}
          style={{
            width: 12,
            height: 12,
            left: width - 6,
            bottom: height - 6,
          }}
        />
      </div>
      <div
        className='border-1 border-solid border-zinc-400 py-4 font-roboto flex flex-col gap-4 mx-auto w-full px-4'
        style={{
          maxWidth: '400px',
          minWidth: '250px',
        }}
      >
        <div className='flex flex-row justify-between w-full'>
          <label className='uppercase font-bold'>Width</label>
          <input
            type='text'
            className='w-14 text-center bg-transparent'
            value={actualWidth}
            onChange={(e) => {
              let newActualWidth = parseInt(
                e.target.value.replace(/[^0-9]/gi, '') || '0'
              );
              let percent = Math.min(newActualWidth / image.w, 1);
              setWidthPercent(percent);
              if (isLocked) {
                setHeightPercent(percent);
              }
            }}
          />
        </div>
        <div className='flex flex-row justify-between w-full'>
          <label className='uppercase font-bold'>Height</label>
          <input
            type='text'
            className='w-14 text-center  bg-transparent'
            value={actualHeight}
            onChange={(e) => {
              let newActualHeight = parseInt(
                e.target.value.replace(/[^0-9]/gi, '') || '0'
              );
              let percent = Math.min(newActualHeight / image.w, 1);
              setHeightPercent(percent);
              if (isLocked) {
                setWidthPercent(percent);
              }
            }}
          />
        </div>
        <button
          className={conditionalStyle(
            'flex justify-center  py-2 rounded-sm border-solid border-2 transition-colors ease-in duration-75',
            isLocked,
            'bg-gray-500 text-gray-300 border-gray-600',
            'bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300 hover:border-gray-400 hover:text-black'
          )}
          onClick={() => {
            if (!isLocked) {
              setHeightPercent(widthPercent);
            }
            setIsLocked(!isLocked);
          }}
        >
          {isLocked ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z' />
            </svg>
          )}
        </button>
        <button
          onClick={async () => {
            setIsDisabled(true);
            const resizedURL = await ImageAPI.resize({
              id: image.id,
              ext: image.ext,
              width,
              height,
            });
            if (downloaderRef.current) {
              downloaderRef.current.href = resizedURL;
              downloaderRef.current.click();
            }
          }}
          className='bg-green-500 hover:bg-green-600 p-4 rounded-sm text-white'
        >
          Download
        </button>
        <a href='#' ref={downloaderRef} target='_blank' download hidden></a>
      </div>
    </div>
  );
}

const ResizePage = () => {
  const [image, setImage] = useState<IMImage | null>(null);
  const [contentRef] = useAutoAnimate<HTMLDivElement>({
    duration: 300,
  });

  return (
    <Layout
      name='Resize'
      onUpload={(image) => setImage(image)}
      hasImage={image !== null}
      contentRef={contentRef}
    >
      {image && contentRef.current && <Editor image={image} />}
    </Layout>
  );
};

export default ResizePage;
