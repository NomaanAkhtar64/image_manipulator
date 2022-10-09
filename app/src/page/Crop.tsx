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
        nX1 = Math.min(nX1, x2);
        nY1 = Math.min(Math.max(pageY - top, 0), max.height) / max.height;
        nY1 = Math.min(nY1, y2);
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
        nX2 = Math.max(nX2, x1);
        nY1 = Math.min(Math.max(pageY - top, 0), max.height) / max.height;
        nY1 = Math.min(nY1, y2);
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
        nX1 = Math.min(nX1, x2);
        nY2 = Math.min(Math.max(pageY - top, 0), max.height) / max.height;
        nY2 = Math.max(nY2, y1);
        if (isLocked) {
          let percent = Math.min(x2 - nX1, nY2 - y1);
          setX2(nX1 + percent);
          nY2 = y1 + percent;
        }
        setX1(Math.min(nX1, x2));
        setY2(Math.max(nY2, y1));
        break;
      case DRAGGING_STATE.BOTTOM_RIGHT:
        nX2 = Math.min(Math.max(pageX - left, 0), max.width) / max.width;
        nX2 = Math.max(nX2, x1);
        nY2 = Math.min(Math.max(pageY - top, 0), max.height) / max.height;
        nY2 = Math.max(nY2, y1);
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
            className='absolute  outline outline-2 outline-teal-500'
            style={{
              ...style,
              background: `url("${image.url}")`,
              backgroundSize: `${max.width}px ${max.height}px`,
              backgroundPosition: `-${style.left}px -${style.top}px`,
            }}
          >
            <button
              className='absolute top-0 left-0 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2  bg-teal-500'
              onMouseDown={() => setDragging(DRAGGING_STATE.TOP_LEFT)}
            />
            <button
              className='absolute top-0 left-full z-10 h-3 w-3  -translate-x-1/2 -translate-y-1/2  bg-teal-500'
              onMouseDown={() => setDragging(DRAGGING_STATE.TOP_RIGHT)}
            />
            <button
              className='absolute top-full left-0 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-teal-500'
              onMouseDown={() => setDragging(DRAGGING_STATE.BOTTOM_LEFT)}
            />
            <button
              className='absolute top-full left-full z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2  bg-teal-500'
              onMouseDown={() => setDragging(DRAGGING_STATE.BOTTOM_RIGHT)}
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
            onChange={(actLeft) => setX1(Math.min(actLeft / image.w, 1))}
          />
          <NumberInput
            label='Y'
            value={actualTop}
            onChange={(actRight) => setY1(Math.min(actRight / image.h, 1))}
          />
          <NumberInput
            label='Width'
            value={actualWidth}
            onChange={(actWidth) => {
              let newX2 = actWidth + x1 * image.w;
              setX2(Math.min(newX2 / image.w, 1));
            }}
          />
          <NumberInput
            label='Height'
            value={actualHeight}
            onChange={(actHeight) => {
              let newY2 = actHeight + y1 * image.h;
              setY2(Math.min(newY2 / image.h, 1));
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
              if (downloaderRef.current) {
                downloaderRef.current.href = await ImageAPI.use('crop', {
                  id: image.id,
                  ext: image.ext,
                  width: actualWidth,
                  height: actualHeight,
                  left: actualLeft,
                  top: actualTop,
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
const CropPage = () => {
  const [image, setImage] = useState<IMImage | null>(null);
  return (
    <Layout
      name='Crop'
      onUpload={(image) => setImage(image)}
      hasImage={image !== null}
    >
      {image && <Editor image={image} />}
    </Layout>
  );
};

export default CropPage;
