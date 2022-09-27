import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { ImageAPI } from '../api/image';
import Layout from '../component/Layout';
import NumberInput from '../component/NumberInput';
import TriggerInput from '../component/TriggerInput';
import { useViewerMaxSize } from '../hooks/viewer';
import { useWindowEvent } from '../hooks/window';
import { CloseLock } from '../icons/CloseLock';
import { OpenLock } from '../icons/OpenLock';
import { DIGIT } from '../utils/regex';

interface EditorProps {
  image: IMImage;
}

enum DRAGGING_STATE {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  NONE,
}

function Editor({ image }: EditorProps) {
  const max = useViewerMaxSize(image); // maximum size of viewer (not the actual image)
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(1);
  const [y2, setY2] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [dragging, setDragging] = useState(DRAGGING_STATE.NONE);

  const downloaderRef = useRef<HTMLAnchorElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const topLeftBtnRef = useRef<HTMLButtonElement>(null);
  const topRightBtnRef = useRef<HTMLButtonElement>(null);
  const bottomLeftBtnRef = useRef<HTMLButtonElement>(null);
  const bottomRightBtnRef = useRef<HTMLButtonElement>(null);

  const actualWidth = Math.round((x2 - x1) * image.w); // actual size: ;
  const actualHeight = Math.round((y2 - y1) * image.h);
  const actualLeft = Math.round(x1 * image.w);
  const actualTop = Math.round(y1 * image.h);

  const style = {
    width: Math.round((x2 - x1) * max.width),
    height: Math.round((y2 - y1) * max.height),
    top: Math.round(y1 * max.height),
    left: Math.round(x1 * max.width),
  };

  const scaleImageFromUIEvent = (pageX: number, pageY: number) => {
    if (bgRef.current === null) return;
    const { top, left } = bgRef.current.getBoundingClientRect();
    let nX1: number, nX2: number, nY1: number, nY2: number;
    switch (dragging) {
      case DRAGGING_STATE.TOP_LEFT:
        nX1 = Math.min(Math.max(pageX - left, 0), max.width) / max.width;
        nY1 = Math.min(Math.max(pageY - top, 0), max.height) / max.height;
        if (isLocked) {
          let percent = Math.min(x2 - nX1, y2 - nY1);
          setX2(nX1 + percent);
          setY2(nY1 + percent);
        }
        setX1(nX1);
        setY1(nY1);
        break;
      case DRAGGING_STATE.TOP_RIGHT:
        nX2 = Math.min(Math.max(pageX - left, 0), max.width) / max.width;
        nY1 = Math.min(Math.max(pageY - top, 0), max.height) / max.height;
        if (isLocked) {
          let percent = Math.min(nX2 - x1, y2 - nY1);
          nX2 = x1 + percent;
          setY2(nY1 + percent);
        }
        setX2(nX2);
        setY1(nY1);
        break;
      case DRAGGING_STATE.BOTTOM_LEFT:
        nX1 = Math.min(Math.max(pageX - left, 0), max.width) / max.width;
        nY2 = Math.min(Math.max(pageY - top, 0), max.height) / max.height;
        if (isLocked) {
          let percent = Math.min(x2 - nX1, nY2 - y1);
          setX2(nX1 + percent);
          nY2 = y1 + percent;
        }
        setX1(nX1);
        setY2(nY2);
        break;
      case DRAGGING_STATE.BOTTOM_RIGHT:
        nX2 = Math.min(Math.max(pageX - left, 0), max.width) / max.width;
        nY2 = Math.min(Math.max(pageY - top, 0), max.height) / max.height;
        if (isLocked) {
          let percent = Math.min(nX2 - x1, nY2 - y1);
          nX2 = percent + x1;
          nY2 = percent + y1;
        }
        setX2(nX2);
        setY2(nY2);
        break;
    }
  };

  useWindowEvent('mouseup', () => {
    setDragging(DRAGGING_STATE.NONE);
  });

  useWindowEvent(
    'mousemove',
    ({ pageX, pageY }) => {
      if (dragging !== DRAGGING_STATE.NONE) {
        scaleImageFromUIEvent(pageX, pageY);
      }
    },
    [dragging]
  );

  useWindowEvent('mousedown', ({ target }) => {
    switch (target) {
      case topLeftBtnRef.current:
        return setDragging(DRAGGING_STATE.TOP_LEFT);
      case topRightBtnRef.current:
        return setDragging(DRAGGING_STATE.TOP_RIGHT);
      case bottomLeftBtnRef.current:
        return setDragging(DRAGGING_STATE.BOTTOM_LEFT);
      case bottomRightBtnRef.current:
        return setDragging(DRAGGING_STATE.BOTTOM_RIGHT);
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
            className='absolute mt-auto outline outline-4 outline-teal-500 dark:outline-teal-900'
            style={{
              ...style,
              background: `url("${image.url}")`,
              backgroundSize: `${max.width}px ${max.height}px`,
              backgroundPosition: `-${style.left}px -${style.top}px`,
            }}
          >
            <button
              className='absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2  bg-teal-600'
              ref={topLeftBtnRef}
              style={{ top: 0, left: 0 }}
            />
            <button
              className='absolute z-10  h-3 w-3  -translate-x-1/2 -translate-y-1/2  bg-teal-600'
              ref={topRightBtnRef}
              style={{ top: 0, left: '100%' }}
            />
            <button
              className='absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-teal-600'
              ref={bottomLeftBtnRef}
              style={{ top: '100%', left: 0 }}
            />
            <button
              className='absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2  bg-teal-600'
              ref={bottomRightBtnRef}
              style={{ top: '100%', left: '100%' }}
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
            label='X'
            value={actualLeft}
            onChange={(e) => {
              let digitStr = e.target.value.replace(DIGIT, '');
              let actLeft = parseInt(digitStr || '0');
              setX1(Math.min(actLeft / image.w, 1));
            }}
          />
          <NumberInput
            label='Y'
            value={actualTop}
            onChange={(e) => {
              let digitStr = e.target.value.replace(DIGIT, '');
              let actRight = parseInt(digitStr || '0');
              setY1(Math.min(actRight / image.h, 1));
            }}
          />
          <NumberInput
            label='Width'
            value={actualWidth}
            onChange={(e) => {
              let digitStr = e.target.value.replace(DIGIT, '');
              let actWidth = parseInt(digitStr || '0');
              let newX2 = actWidth + x1 * image.w;
              setX2(Math.min(newX2 / image.w, 1));
            }}
          />
          <NumberInput
            label='Height'
            value={actualHeight}
            onChange={(e) => {
              let digitStr = e.target.value.replace(DIGIT, '');
              let actHeight = parseInt(digitStr || '0');
              let newY2 = actHeight + y1 * image.h;
              setY2(Math.min(newY2 / image.w, 1));
            }}
          />
          <TriggerInput
            value={isLocked}
            onClick={() => {
              if (!isLocked) {
                let percent = Math.min(x2 - x1, y2 - y1);
                setX2(x1 + percent);
                setY2(y1 + percent);
              }
              setIsLocked(!isLocked);
            }}
            trueIcon={<CloseLock />}
            falseIcon={<OpenLock />}
          />
          <button
            onClick={async () => {
              const resizedURL = await ImageAPI.crop({
                id: image.id,
                ext: image.ext,
                width: actualWidth,
                height: actualHeight,
                left: actualLeft,
                top: actualTop,
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
const CropPage = () => {
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
      name='Crop'
      onUpload={(image) => setImage(image)}
      hasImage={image !== null}
      contentRef={contentRef}
    >
      {image && contentRef.current && <Editor image={image} />}
    </Layout>
  );
};

export default CropPage;

