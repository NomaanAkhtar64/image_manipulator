import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { ImageAPI } from '../api/image';
import Layout from '../component/Layout';
import TriggerInput from '../component/TriggerInput';
import NumberInput from '../component/NumberInput';
import { useViewerMaxSize } from '../hooks/viewer';
import { CloseLock } from '../icons/CloseLock';
import { OpenLock } from '../icons/OpenLock';
import { getDiagonalPercent } from '../utils/size';
import { useWindowEvent } from '../hooks/window';

interface EditorProps {
  image: IMImage;
}

function Editor({ image }: EditorProps) {
  const [widthPercent, setWidthPercent] = useState(1); // percent
  const [heightPercent, setHeightPercent] = useState(1); // percent
  const max = useViewerMaxSize(image); // maximum size of viewer (not the actual image)

  const width = Math.round(widthPercent * max.width); // maximum image size of selected region in viewer
  const height = Math.round(heightPercent * max.height);

  const actualWidth = Math.round(image.w * widthPercent); // actual size: ;
  const actualHeight = Math.round(image.h * heightPercent);

  const downloaderRef = useRef<HTMLAnchorElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [isLocked, setIsLocked] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const scaleImageFromUIEvent = (pageX: number, pageY: number) => {
    if (bgRef.current === null) return;
    const { top, left } = bgRef.current.getBoundingClientRect();
    let w = pageX - left;
    let h = max.height - (pageY - top);

    h = Math.max(h, 0);
    h = Math.min(h, max.height);

    w = Math.max(w, 0);
    w = Math.min(w, max.width);

    let hpercent = h / max.height;
    let wpercent = w / max.width;

    if (isLocked) {
      const percent = Math.min(wpercent, hpercent);
      setWidthPercent(percent);
      setHeightPercent(percent);
    } else {
      setWidthPercent(wpercent);
      setHeightPercent(hpercent);
    }
  };

  useWindowEvent('mouseup', () => {
    setIsDragging(false);
  });

  useWindowEvent(
    'mousemove',
    ({ pageX, pageY }) => {
      if (isDragging) {
        scaleImageFromUIEvent(pageX, pageY);
      }
    },
    [isDragging]
  );

  useWindowEvent('mousedown', ({ target }) => {
    if (target === btnRef.current) {
      setIsDragging(true);
    }
  });
  return (
    <div className='flex w-full justify-center py-4'>
      <div className='z-10 flex flex-col  lg:flex-row'>
        <div
          className='relative flex'
          style={{
            minWidth: max.width,
            minHeight: max.height,
          }}
          ref={bgRef}
        >
          <div className='absolute top-0 left-0 right-0 bottom-0 z-10'></div>
          <div
            className='absolute top-0 left-0 right-0 bottom-0 -z-10'
            style={{
              width: max.width,
              height: max.height,
              overflow: 'hidden',
              background: `url("${image.url}")`,
              WebkitFilter: 'blur(8px)',
              filter: 'blur(8px)',
              backgroundSize: `${max.width}px ${max.height}px`,
            }}
          />
          <div
            className='mt-auto outline outline-4 outline-teal-500 dark:outline-teal-900'
            style={{
              width,
              height,
              background: `url("${image.url}")`,
              backgroundSize: `${width}px ${height}px`,
            }}
          >
            <button
              className='absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-teal-600'
              ref={btnRef}
              style={{
                left: width,
                top: max.height - height,
              }}
            />
          </div>
        </div>

        <div
          className='border-1 font-roboto mx-auto flex w-full flex-col gap-4 border-solid border-zinc-400 py-4 px-4 dark:text-zinc-300'
          style={{
            maxWidth: '400px',
            minWidth: '250px',
          }}
        >
          <NumberInput
            label='Width'
            value={actualWidth}
            onChange={(e) => {
              let digitStr = e.target.value.replace(/[^0-9]/gi, '');
              let newActualWidth = Math.min(parseInt(digitStr || '0'), 1);
              let percent = newActualWidth / image.h;
              setWidthPercent(percent);
              if (isLocked) {
                setHeightPercent(percent);
              }
            }}
          />
          <NumberInput
            label='Height'
            value={actualHeight}
            onChange={(e) => {
              let digitStr = e.target.value.replace(/[^0-9]/gi, '');
              let newActualHeight = Math.min(parseInt(digitStr || '0'), 1);
              let percent = newActualHeight / image.h;
              setHeightPercent(percent);
              if (isLocked) {
                setWidthPercent(percent);
              }
            }}
          />
          <TriggerInput
            value={isLocked}
            onClick={() => {
              if (!isLocked) {
                let percent = width / max.width;
                setHeightPercent(percent);
              }
              setIsLocked(!isLocked);
            }}
            trueIcon={<CloseLock />}
            falseIcon={<OpenLock />}
          />
          <button
            onClick={async () => {
              const resizedURL = await ImageAPI.resize({
                id: image.id,
                ext: image.ext,
                width: actualWidth,
                height: actualHeight,
              });
              if (downloaderRef.current) {
                downloaderRef.current.href = resizedURL;
                downloaderRef.current.click();
              }
            }}
            className='rounded-sm  bg-teal-600 p-4 text-white hover:bg-teal-700  dark:bg-teal-800 dark:text-zinc-300 dark:hover:bg-teal-600 '
          >
            Download
          </button>
          <a href='#' ref={downloaderRef} target='_blank' download hidden></a>
        </div>
      </div>
    </div>
  );
}

const ResizePage = () => {
  const [image, setImage] = useState<IMImage | null>({
    id: '257cc6fca478493ca4afb9e1abecae40',
    client: 'cc9a538a-9567-4342-b94c-bb7a34a9f68b',
    url: `http://${location.hostname}:4000/images/upload/257cc6fca478493ca4afb9e1abecae40.jpg`,
    w: 5464,
    h: 3643,
    ext: 'jpg',
  });
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

