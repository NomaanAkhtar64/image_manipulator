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
import { DIGIT } from '../utils/regex';

interface EditorProps {
  image: IMImage;
}

function Editor({ image }: EditorProps) {
  // const [widthPercent, setWidthPercent] = useState(1); // percent
  const [actualWidth, setActualWidth] = useState(image.w);
  const [actualHeight, setActualHeight] = useState(image.h);
  // const [heightPercent, setHeightPercent] = useState(1); // percent
  const max = useViewerMaxSize(image); // maximum size of viewer (not the actual image)

  const widthPercent = actualWidth / image.w;
  const heightPercent = actualHeight / image.h;

  const width = Math.round(widthPercent * max.width); // maximum image size of selected region in viewer
  const height = Math.round(heightPercent * max.height);

  // const actualWidth = Math.round(image.w * widthPercent); // actual size: ;
  // const actualHeight = Math.round(image.h * heightPercent);

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
      setActualWidth(Math.round(percent * image.w));
      setActualHeight(Math.round(percent * image.h));
    } else {
      setActualWidth(Math.round(wpercent * image.w));
      setActualHeight(Math.round(hpercent * image.h));
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
            className='absolute top-0 left-0 right-0 bottom-0 -z-10 '
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
            className='mt-auto  outline outline-2 outline-teal-500'
            style={{
              width,
              height,
              background: `url("${image.url}")`,
              backgroundSize: `${width}px ${height}px`,
            }}
          >
            <button
              className='absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-teal-500'
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
            onChange={(v) => {
              let w = Math.min(v, image.w);
              setActualWidth(w);
              if (isLocked) {
                let percent = w / image.w;
                setActualHeight(Math.round(percent * image.h));
              }
            }}
          />
          <NumberInput
            label='Height'
            value={actualHeight}
            onChange={(v) => {
              let h = Math.min(v, image.h);
              setActualHeight(h);
              if (isLocked) {
                let percent = h / image.h;
                setActualWidth(Math.round(percent * image.w));
              }
            }}
          />
          <TriggerInput
            value={isLocked}
            onClick={() => {
              if (!isLocked) {
                let percent = width / max.width;
                setActualHeight(Math.round(percent * image.h));
              }
              setIsLocked(!isLocked);
            }}
            trueIcon={<CloseLock />}
            falseIcon={<OpenLock />}
          />
          <button
            onClick={async () => {
              if (downloaderRef.current) {
                downloaderRef.current.href = await ImageAPI.use('resize', {
                  id: image.id,
                  ext: image.ext,
                  width: actualWidth,
                  height: actualHeight,
                });
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
  const [image, setImage] = useState<IMImage | null>(null);
  return (
    <Layout
      name='Resize'
      onUpload={(image) => setImage(image)}
      hasImage={image !== null}
    >
      {image && <Editor image={image} />}
    </Layout>
  );
};

export default ResizePage;
